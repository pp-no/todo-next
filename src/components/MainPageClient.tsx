// components/MainPageClient.tsx (クライアントコンポーネント)
'use client';

import { useState, useEffect } from 'react';
import TaskCard from '@/components/TaskCard/TaskCard';
import { TaskDocument } from '@/models/task';
import Link from 'next/link';

import { VscAdd, VscClose } from 'react-icons/vsc';
import { TfiMenu } from 'react-icons/tfi';
import { BiTask, BiHome, BiCheckCircle, BiTimeFive } from 'react-icons/bi';

interface MainPageClientProps {
	allTasks: TaskDocument[];
}

export default function MainPageClient({ allTasks }: MainPageClientProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

	const allPageCnt = allTasks.length;

	// 完了・未完了タスクのカウント
	const completedTasks = allTasks.filter(task => task.isCompleted).length;
	const pendingTasks = allPageCnt - completedTasks;

	// フィルタリングされたタスク
	const filteredTasks = allTasks.filter(task => {
		if (filterStatus === 'pending') return !task.isCompleted;
		if (filterStatus === 'completed') return task.isCompleted;
		return true;
	});

	// メニューを閉じる
	const closeMenu = () => setIsMenuOpen(false);

	// メニューが開いている時はスクロールを防止
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMenuOpen]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* サイドメニュー（モバイル） */}
			<div
				className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
					isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
				}`}
			>
				{/* オーバーレイ */}
				<div
					className="absolute inset-0 bg-black/50 backdrop-blur-sm"
					onClick={closeMenu}
				/>

				{/* メニューコンテンツ */}
				<div
					className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
						isMenuOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<div className="p-6">
						{/* メニューヘッダー */}
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-3">
								<div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
									<BiTask className="text-white text-xl" />
								</div>
								<h2 className="text-xl font-bold text-gray-800">Menu</h2>
							</div>
							<button
								onClick={closeMenu}
								className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
								aria-label="メニューを閉じる"
							>
								<VscClose className="text-xl" />
							</button>
						</div>

						{/* メニュー項目 */}
						<nav className="space-y-2">
							<button
								onClick={() => {
									setFilterStatus('all');
									closeMenu();
								}}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
									filterStatus === 'all'
										? 'bg-blue-50 text-blue-700 font-semibold'
										: 'text-gray-700 hover:bg-gray-50'
								}`}
							>
								<BiHome className="text-xl" />
								<span>All Tasks</span>
								<span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
									{allPageCnt}
								</span>
							</button>

							<button
								onClick={() => {
									setFilterStatus('pending');
									closeMenu();
								}}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
									filterStatus === 'pending'
										? 'bg-amber-50 text-amber-700 font-semibold'
										: 'text-gray-700 hover:bg-gray-50'
								}`}
							>
								<BiTimeFive className="text-xl" />
								<span>Pending</span>
								<span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
									{pendingTasks}
								</span>
							</button>

							<button
								onClick={() => {
									setFilterStatus('completed');
									closeMenu();
								}}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
									filterStatus === 'completed'
										? 'bg-green-50 text-green-700 font-semibold'
										: 'text-gray-700 hover:bg-gray-50'
								}`}
							>
								<BiCheckCircle className="text-xl" />
								<span>Completed</span>
								<span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
									{completedTasks}
								</span>
							</button>
						</nav>

						{/* 新規作成ボタン */}
						<Link
							href="/new"
							onClick={closeMenu}
							className="mt-6 flex items-center justify-center gap-2 w-full font-semibold px-6 py-3 rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
						>
							<VscAdd className="text-xl" />
							<span>Add New Task</span>
						</Link>
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* ヘッダー */}
				<header className="mb-8">
					<div className="flex justify-between items-center mb-6">
						<button
							onClick={() => setIsMenuOpen(true)}
							type="button"
							className="md:hidden text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-white/50"
							aria-label="メニューを開く"
						>
							<TfiMenu className="text-xl" />
						</button>

						<div className="flex items-center gap-3">
							<div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
								<BiTask className="text-white text-2xl" />
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
								{filterStatus === 'all' && 'My Tasks'}
								{filterStatus === 'pending' && 'Pending'}
								{filterStatus === 'completed' && 'Completed'}
							</h1>
						</div>

						<Link
							href="/new"
							className="flex items-center gap-2 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-xl hover:scale-105"
						>
							<VscAdd className="text-lg sm:text-xl" />
							<span className="hidden sm:inline">Add Task</span>
							<span className="sm:hidden">Add</span>
						</Link>
					</div>

					{/* デスクトップ用フィルター */}
					<div className="hidden md:flex gap-3 mb-6">
						<button
							onClick={() => setFilterStatus('all')}
							className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
								filterStatus === 'all'
									? 'bg-blue-100 text-blue-700 font-semibold'
									: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
							}`}
						>
							<BiHome className="text-lg" />
							<span>All</span>
							<span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
								{allPageCnt}
							</span>
						</button>
						<button
							onClick={() => setFilterStatus('pending')}
							className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
								filterStatus === 'pending'
									? 'bg-amber-100 text-amber-700 font-semibold'
									: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
							}`}
						>
							<BiTimeFive className="text-lg" />
							<span>Pending</span>
							<span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
								{pendingTasks}
							</span>
						</button>
						<button
							onClick={() => setFilterStatus('completed')}
							className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
								filterStatus === 'completed'
									? 'bg-green-100 text-green-700 font-semibold'
									: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
							}`}
						>
							<BiCheckCircle className="text-lg" />
							<span>Completed</span>
							<span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
								{completedTasks}
							</span>
						</button>
					</div>

					{/* 統計情報カード */}
					<div className="grid grid-cols-3 gap-3 sm:gap-4">
						<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
							<p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
							<p className="text-2xl sm:text-3xl font-bold text-gray-800">{allPageCnt}</p>
						</div>
						<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
							<p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
							<p className="text-2xl sm:text-3xl font-bold text-amber-600">{pendingTasks}</p>
						</div>
						<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
							<p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
							<p className="text-2xl sm:text-3xl font-bold text-green-600">{completedTasks}</p>
						</div>
					</div>
				</header>

				{/* タスク一覧 */}
				<main>
					{filteredTasks.length === 0 ? (
						// タスクが0件の場合のEmptyステート
						<div className="flex flex-col items-center justify-center py-16 sm:py-24">
							<div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full mb-6">
								<BiTask className="text-5xl sm:text-6xl text-blue-600" />
							</div>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
								{filterStatus === 'all' && 'No tasks yet'}
								{filterStatus === 'pending' && 'No pending tasks'}
								{filterStatus === 'completed' && 'No completed tasks'}
							</h2>
							<p className="text-gray-600 text-center mb-6 px-4">
								{filterStatus === 'all' && 'Get started by creating your first task'}
								{filterStatus === 'pending' && 'All tasks are completed! 🎉'}
								{filterStatus === 'completed' && 'Complete some tasks to see them here'}
							</p>
							{filterStatus === 'all' && (
								<Link
									href="/new"
									className="flex items-center gap-2 font-semibold px-6 py-3 rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-xl hover:scale-105"
								>
									<VscAdd className="text-xl" />
									<span>Create First Task</span>
								</Link>
							)}
						</div>
					) : (
						<div className="space-y-3 sm:space-y-4">
							{filteredTasks.map(task => (
								<div
									key={task._id}
									className="transform transition-all duration-200 hover:scale-[1.01]"
								>
									<TaskCard task={task} />
								</div>
							))}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}