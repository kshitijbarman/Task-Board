import React, { useEffect, useState } from "react";
import axios from "axios";
import baseurl from "../BaseUrl";
import { getAuthHeaders } from "../utils/authHeaders";
import { Pencil, Trash2, Check } from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TouchSensor } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableTask({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.task);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px",
    marginBottom: "6px",
    backgroundColor: "#fef9c3",
    borderRadius: "8px",
    cursor: "grab",
    position: "relative",
  };

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(task._id, editedText);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {isEditing ? (
        <div className="flex gap-1 items-center">
          <input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
          <Check
            size={16}
            className="text-green-600 cursor-pointer"
            onClick={handleSave}
          />
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{task.task}</span>
          <div className="flex gap-2">
            <Pencil
              size={16}
              className="text-blue-600 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
            <Trash2
              size={16}
              className="text-red-600 cursor-pointer"
              onClick={() => onDelete(task._id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const TaskManager = () => {
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [newListName, setNewListName] = useState("");
  const [taskInputs, setTaskInputs] = useState({});
  const [showListInput, setShowListInput] = useState(false);

  const getLists = async () => {
    try {
      const res = await axios.get(
        `${baseurl}/list/getalllists`,
        getAuthHeaders()
      );
      setLists(res.data.list || res.data.data);
    } catch (err) {
      console.error("Failed to fetch lists:", err);
    }
  };

  const getTasks = async () => {
    try {
      const res = await axios.get(
        `${baseurl}/task/showtasks`,
        getAuthHeaders()
      );
      const grouped = {};
      for (let task of res.data.data) {
        const listId = task.listId;
        if (!grouped[listId]) grouped[listId] = [];
        grouped[listId].push(task);
      }
      setTasksByList(grouped);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const addList = async () => {
    if (!newListName.trim()) return;
    try {
      const res = await axios.post(
        `${baseurl}/list/addinglist`,
        { list: newListName },
        getAuthHeaders()
      );
      setLists((prev) => [...prev, res.data.list]);
      setNewListName("");
      setShowListInput(false);
    } catch (err) {
      console.error("Failed to add list:", err);
    }
  };

  const deleteTask = async (listId, taskId) => {
    try {
      await axios.delete(
        `${baseurl}/task/deletetask/${taskId}`,
        getAuthHeaders()
      );
      setTasksByList((prev) => {
        const updatedList = prev[listId]?.filter((task) => task._id !== taskId);
        return {
          ...prev,
          [listId]: updatedList,
        };
      });
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const editTask = async (listId, taskId, newText) => {
    try {
      await axios.put(
        `${baseurl}/task/updatetask/${taskId}`,
        { task: newText },
        getAuthHeaders()
      );
      setTasksByList((prev) => {
        const updatedTasks = prev[listId]?.map((task) =>
          task._id === taskId ? { ...task, task: newText } : task
        );
        return {
          ...prev,
          [listId]: updatedTasks,
        };
      });
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteList = async (id) => {
    try {
      await axios.delete(`${baseurl}/list/deletelist/${id}`, getAuthHeaders());
      setLists((prev) => prev.filter((list) => list._id !== id));
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const addTask = async (listId) => {
    const text = taskInputs[listId]?.trim();
    if (!text) return;

    try {
      const res = await axios.post(
        `${baseurl}/task/addtask`,
        { listId, task: text },
        getAuthHeaders()
      );
      setTasksByList((prev) => ({
        ...prev,
        [listId]: [...(prev[listId] || []), res.data.data],
      }));
      setTaskInputs((prev) => ({ ...prev, [listId]: "" }));
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;
    if (!activeId || !overId || activeId === overId) return;

    let sourceListId = null;
    let destinationListId = null;
    let movedTask = null;

    for (const [listId, tasks] of Object.entries(tasksByList)) {
      if (tasks.find((t) => t._id === activeId)) {
        sourceListId = listId;
        movedTask = tasks.find((t) => t._id === activeId);
      }
      if (tasks.find((t) => t._id === overId)) {
        destinationListId = listId;
      }
    }

    if (!sourceListId || !destinationListId) return;

    try {
      await axios.put(
        `${baseurl}/task/updatelist/${activeId}`,
        { listId: destinationListId },
        getAuthHeaders()
      );
      setTasksByList((prev) => {
        const newSource = prev[sourceListId].filter((t) => t._id !== activeId);
        const newDest = [
          ...(prev[destinationListId] || []),
          { ...movedTask, listId: destinationListId },
        ];
        return {
          ...prev,
          [sourceListId]: newSource,
          [destinationListId]: newDest,
        };
      });
    } catch (err) {
      console.error("Error moving task:", err);
    }
  };

  useEffect(() => {
    getLists();
    getTasks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-200">
      <h1 className="text-3xl font-bold mb-6 text-yellow-900">
        📝 Task Manager
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-wrap gap-6">
          {lists.map((list) => (
            <div
              key={list._id}
              className="relative bg-white rounded-xl shadow-xl p-4 w-full sm:w-64 border border-yellow-300"
            >
              <h2 className="font-bold text-lg mb-2 text-yellow-800">
                {list.list}
              </h2>
              <SortableContext
                id={list._id}
                items={(tasksByList[list._id] || []).map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                {(tasksByList[list._id] || []).map((task) => (
                  <SortableTask
                    key={task._id}
                    task={task}
                    onEdit={(taskId, newText) =>
                      editTask(list._id, taskId, newText)
                    }
                    onDelete={(taskId) => deleteTask(list._id, taskId)}
                  />
                ))}
              </SortableContext>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <input
                  type="text"
                  value={taskInputs[list._id] || ""}
                  placeholder="Add task"
                  onChange={(e) =>
                    setTaskInputs({ ...taskInputs, [list._id]: e.target.value })
                  }
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button
                  onClick={() => addTask(list._id)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 rounded text-sm"
                >
                  Add
                </button>
              </div>
              <button
                onClick={() => deleteList(list._id)}
                className="absolute top-2 right-2 text-red-500"
              >
                ×
              </button>
            </div>
          ))}

          <div className="bg-white border border-yellow-300 rounded-xl shadow-xl p-4 w-64 flex items-center justify-center">
            {!showListInput ? (
              <button
                onClick={() => setShowListInput(true)}
                className="text-yellow-600 font-bold text-lg"
              >
                + Add List
              </button>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  value={newListName}
                  placeholder="Enter list name"
                  onChange={(e) => setNewListName(e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addList}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowListInput(false)}
                    className="text-gray-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default TaskManager;
