'use client';

import { createTask, FormState } from '@/actions/task';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { VscAdd } from 'react-icons/vsc';
import { BiArrowBack } from 'react-icons/bi';
import Link from 'next/link';

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
					<span>作成中...</span>
				</>
			) : (
				<>
					<VscAdd className="text-lg" />
					<span>タスクを作成</span>
				</>
			)}
		</button>
	);
};

const NewTaskForm = () => {
	const initialState: FormState = { error: '' };
	const [state, formAction] = useActionState(createTask, initialState);

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
				<h1 className="text-2xl font-bold text-gray-900 mb-1">新しいタスクを作成</h1>
				<p className="text-gray-500 text-sm">必須項目をすべて入力してください</p>
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
						required
						placeholder="タスクのタイトルを入力"
						maxLength={100}
						className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
					/>
					<p className="text-xs text-gray-400 mt-1">最大100文字</p>
				</div>

				<div className="mb-5">
					<label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
						説明 <span className="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						name="description"
						required
						placeholder="タスクの詳細を入力"
						maxLength={500}
						rows={4}
						className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
					/>
					<p className="text-xs text-gray-400 mt-1">最大500文字</p>
				</div>

				<div className="mb-6">
					<label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
						期限日 <span className="text-red-500">*</span>
					</label>
					<input
						type="date"
						id="dueDate"
						name="dueDate"
						min={new Date().toISOString().split('T')[0]}
						max="2999-12-31"
						required
						className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
					/>
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

export default NewTaskForm;
