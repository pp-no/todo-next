'use client';

import { FormState, updateTask } from '@/actions/task';
import { TaskDocument } from '@/models/task';
import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { PiArrowLeft, PiCheck } from 'react-icons/pi';
import Link from 'next/link';

interface EditTaskFormProps {
	task: TaskDocument;
}

// レンダーのたびに再生成されないようモジュールスコープに置く
const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending} className="btn-primary w-full mt-8">
			{pending ? (
				<>
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					<span>更新中...</span>
				</>
			) : (
				<>
					<PiCheck className="text-lg" />
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
					className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors mb-4 px-3 py-2 rounded-lg hover:bg-card"
				>
					<PiArrowLeft className="text-lg" />
					<span className="text-sm font-bold">戻る</span>
				</Link>
				<h1 className="font-hand text-3xl text-ink mb-1">
					<span className="marker">タスクを編集</span>
				</h1>
				<p className="text-ink-soft text-sm">内容を変更して更新してください</p>
			</div>

			{/* フォーム */}
			<form action={formAction} className="sketch-card p-6">
				{state.error && (
					<div className="mb-6 p-4 bg-berry/10 border-2 border-berry rounded-2xl">
						<p className="text-berry text-sm font-bold">{state.error}</p>
					</div>
				)}

				<div className="mb-5">
					<label htmlFor="title" className="block text-sm font-bold text-ink mb-2">
						タイトル <span className="text-berry">*</span>
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
						className="field"
					/>
					<p className="text-xs text-ink-soft mt-1">{title.length}/100文字</p>
				</div>

				<div className="mb-5">
					<label htmlFor="description" className="block text-sm font-bold text-ink mb-2">
						説明 <span className="text-berry">*</span>
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
						className="field resize-none"
					/>
					<p className="text-xs text-ink-soft mt-1">{description.length}/500文字</p>
				</div>

				<div className="mb-5">
					<label htmlFor="dueDate" className="block text-sm font-bold text-ink mb-2">
						期限日 <span className="text-berry">*</span>
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
						className="field"
					/>
				</div>

				{/* 完了チェックボックス */}
				<div className="mb-6 p-4 bg-leaf/10 rounded-2xl border-2 border-leaf">
					<label htmlFor="isCompleted" className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							id="isCompleted"
							name="isCompleted"
							checked={isCompleted}
							onChange={e => setIsCompleted(e.target.checked)}
							className="w-5 h-5 rounded cursor-pointer accent-leaf"
						/>
						<span className="text-sm font-bold text-ink">完了済みにする</span>
						{isCompleted && <PiCheck className="ml-auto text-lg text-leaf" />}
					</label>
				</div>

				<SubmitButton />

				<Link href="/" className="btn-ghost w-full mt-3">
					キャンセル
				</Link>
			</form>
		</div>
	);
};

export default EditTaskForm;
