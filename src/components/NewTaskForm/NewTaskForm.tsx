'use client';

import { createTask, FormState } from '@/actions/task';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { PiPlusBold, PiArrowLeft } from 'react-icons/pi';
import Link from 'next/link';

// レンダーのたびに再生成されないようモジュールスコープに置く
const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="btn-primary w-full mt-8"
		>
			{pending ? (
				<>
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					<span>作成中...</span>
				</>
			) : (
				<>
					<PiPlusBold className="text-lg" />
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
					className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors mb-4 px-3 py-2 rounded-lg hover:bg-card"
				>
					<PiArrowLeft className="text-lg" />
					<span className="text-sm font-bold">戻る</span>
				</Link>
				<h1 className="font-hand text-3xl text-ink mb-1">
					<span className="marker">新しいタスクを作成</span>
				</h1>
				<p className="text-ink-soft text-sm">必須項目をすべて入力してください</p>
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
						required
						placeholder="タスクのタイトルを入力"
						maxLength={100}
						className="field"
					/>
					<p className="text-xs text-ink-soft mt-1">最大100文字</p>
				</div>

				<div className="mb-5">
					<label htmlFor="description" className="block text-sm font-bold text-ink mb-2">
						説明 <span className="text-berry">*</span>
					</label>
					<textarea
						id="description"
						name="description"
						required
						placeholder="タスクの詳細を入力"
						maxLength={500}
						rows={4}
						className="field resize-none"
					/>
					<p className="text-xs text-ink-soft mt-1">最大500文字</p>
				</div>

				<div className="mb-6">
					<label htmlFor="dueDate" className="block text-sm font-bold text-ink mb-2">
						期限日 <span className="text-berry">*</span>
					</label>
					<input
						type="date"
						id="dueDate"
						name="dueDate"
						min={new Date().toISOString().split('T')[0]}
						max="2999-12-31"
						required
						className="field"
					/>
				</div>

				<SubmitButton />

				<Link
					href="/"
					className="btn-ghost w-full mt-3"
				>
					キャンセル
				</Link>
			</form>
		</div>
	);
};

export default NewTaskForm;
