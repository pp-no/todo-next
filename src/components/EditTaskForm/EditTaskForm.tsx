// タスク編集
"use client";

import { FormState, updateTask } from "@/actions/task";
import { TaskDocument } from "@/models/task";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { BiArrowBack, BiCheck } from "react-icons/bi";
import Link from "next/link";
import { VscClose } from "react-icons/vsc";

interface EditTaskFormProps {
  task: TaskDocument;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  const updateTaskWithId = updateTask.bind(null, task._id);
  const initialState: FormState = { error: "" };
  const [state, formAction] = useFormState(updateTaskWithId, initialState);

  const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full mt-8 py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Updating...</span>
          </>
        ) : (
          <>
            <BiCheck className="text-lg" />
            <span>Update Task</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 px-3 py-2 rounded-lg hover:bg-white/50"
          >
            <BiArrowBack className="text-lg" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Task</h1>
          <p className="text-gray-600">Update your task details</p>
        </div>

        {/* フォームコンテナ */}
        <form action={formAction} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* エラーメッセージ */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{state.error}</p>
            </div>
          )}

          {/* タイトル */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title..."
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
          </div>

          {/* 説明 */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter task description..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder-gray-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
          </div>

          {/* 期限 */}
          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-800 mb-2">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              min="2020-01-01"
              max="2999-12-31"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-900"
            />
          </div>

          {/* 完了チェックボックス */}
          <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
            <label htmlFor="isCompleted" className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isCompleted"
                name="isCompleted"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="w-5 h-5 rounded-lg cursor-pointer accent-green-600"
              />
              <span className="ml-3 text-sm font-medium text-gray-800">
                Mark as completed
              </span>
              {isCompleted && (
                <BiCheck className="ml-auto text-lg text-green-600" />
              )}
            </label>
          </div>

          {/* ボタン */}
          <SubmitButton />

          {/* キャンセルボタン */}
          <Link
            href="/"
            className="block w-full mt-3 py-3 px-4 rounded-xl text-center text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </Link>
        </form>

        {/* 現在の状態表示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 font-medium mb-2">📋 Current Status:</p>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <BiCheck className="text-sm" />
                  Completed
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  <VscClose className="text-sm" />
                  In Progress
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;