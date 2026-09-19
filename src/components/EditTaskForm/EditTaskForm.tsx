'use client';

import { FormState, updateTask } from '@/actions/task';
import { TaskDocument } from '@/models/task';
import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { BiArrowBack, BiCheck } from 'react-icons/bi';
import Link from 'next/link';

interface EditTaskFormProps {
	task: TaskDocument;
}

// レンダーのたびに再生成されないようモジュールスコープに置く
const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full mt-8 py-3 px-4 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
		>
			{pending ? (
				<>
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					<span>更新中...</span>
				</>
			) : (
				<>
					<BiCheck className="text-lg" />
					<span>タスクを更新</span>
				</>
			)}
		</button>
	);
};

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task }) => {
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description);
	const [dueDate, setDueDate] = useState(task.dueDate);
	const [isCompleted, setIsCompleted] = useState(task.isCompleted);

	const updateTaskWithId = updateTask.bind(null, task._id);
	const initialState: FormState = { error: '' };
	const [state, formAction] = useActionState(updateTaskWithId, initialState);

	return (
		<div className="max-w-md mx-auto px-4">
			{/* ヘッダー */}
			<div className="mb-8">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 px-3 py-2 rounded-lg hover:bg-white"
				>
					<BiArrowBack className="text-lg" />
					<span className="text-sm font-medium">戻る</span>
				</Link>
				<h1 className="text-2xl font-bold text-gray-900 mb-1">タスクを編集</h1>
				<p className="text-gray-500 text-sm">内容を変更して更新してください</p>
			</div>

			{/* フォーム */}
			<form action={formAction} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
				{state.error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
						<p className="text-red-700 text-sm font-medium">{state.error}</p>
					</div>
				)}

				<div className="mb-5">
					<label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
						タイトル <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={title}
						onChange={e => setTitle(e.target.value)}
						required
						placeholder="タスクのタイトルを入力"
						maxLength={100}
						className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
					/>
					<p className="text-xs text-gray-400 mt-1">{title.length}/100文字</p>
				</div>

				<div className="mb-5">
					<label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
						説明 <span className="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						name="description"
						value={description}
						onChange={e => setDescription(e.target.value)}
						required
						placeholder="タスクの詳細を入力"
						maxLength={500}
						rows={4}
						className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
					/>
					<p className="text-xs text-gray-400 mt-1">{description.length}/500文字</p>
				</div>

				<div className="mb-5">
					<label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
						期限日 <span className="text-red-500">*</span>
					</label>
					<input
						type="date"
						id="dueDate"
						name="dueDate"
						min="2020-01-01"
						max="2999-12-31"
						value={dueDate}
						onChange={e => setDueDate(e.target.value)}
						required
						className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
					/>
				</div>

				{/* 完了チェックボックス */}
				<div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
					<label htmlFor="isCompleted" className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							id="isCompleted"
							name="isCompleted"
							checked={isCompleted}
							onChange={e => setIsCompleted(e.target.checked)}
							className="w-5 h-5 rounded cursor-pointer accent-green-600"
						/>
						<span className="text-sm font-medium text-gray-800">完了済みにする</span>
						{isCompleted && <BiCheck className="ml-auto text-lg text-green-600" />}
					</label>
				</div>

				<SubmitButton />

				<Link
					href="/"
					className="block w-full mt-3 py-3 px-4 rounded-xl text-center text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
				>
					キャンセル
				</Link>
			</form>
		</div>
	);
};

export default EditTaskForm;
