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
	const completedTasks = allTasks.filter(task => task.isCompleted).length;
	const pendingTasks = allPageCnt - completedTasks;

	const filteredTasks = allTasks.filter(task => {
		if (filterStatus === 'pending') return !task.isCompleted;
		if (filterStatus === 'completed') return task.isCompleted;
		return true;
	});

	const closeMenu = () => setIsMenuOpen(false);

	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
		return () => { document.body.style.overflow = 'unset'; };
	}, [isMenuOpen]);

	const filterItems = [
		{ label: 'すべて', status: 'all' as const, icon: <BiHome />, count: allPageCnt },
		{ label: '未完了', status: 'pending' as const, icon: <BiTimeFive />, count: pendingTasks },
		{ label: '完了済み', status: 'completed' as const, icon: <BiCheckCircle />, count: completedTasks },
	];

	return (
		<div className="min-h-screen">
			{/* モバイルサイドメニュー */}
			<div
				className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
					isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
				}`}
			>
				<div className="absolute inset-0 bg-black/40" onClick={closeMenu} />
				<div
					className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ${
						isMenuOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<div className="p-5">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="bg-blue-600 p-2 rounded-xl">
									<BiTask className="text-white text-xl" />
								</div>
								<h2 className="text-xl font-bold text-gray-900">My ToDo</h2>
							</div>
							<button
								onClick={closeMenu}
								className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
								aria-label="メニューを閉じる"
							>
								<VscClose className="text-xl" />
							</button>
						</div>

						<nav className="space-y-1">
							{filterItems.map(item => (
								<button
									key={item.status}
									onClick={() => { setFilterStatus(item.status); closeMenu(); }}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
										filterStatus === item.status
											? 'bg-blue-50 text-blue-700 font-semibold'
											: 'text-gray-600 hover:bg-gray-50'
									}`}
								>
									<span className="text-lg">{item.icon}</span>
									<span>{item.label}</span>
									<span
										className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${
											filterStatus === item.status
												? 'bg-blue-100 text-blue-700'
												: 'bg-gray-100 text-gray-600'
										}`}
									>
										{item.count}
									</span>
								</button>
							))}
						</nav>

						<Link
							href="/new"
							onClick={closeMenu}
							className="mt-6 flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
						>
							<VscAdd />
							<span>新しいタスク</span>
						</Link>
					</div>
				</div>
			</div>

			{/* メインコンテンツ */}
			<div className="max-w-3xl mx-auto px-6 py-8">
				{/* ヘッダー */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setIsMenuOpen(true)}
							className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm transition-all"
							aria-label="メニューを開く"
						>
							<TfiMenu className="text-xl" />
						</button>
						<h1 className="text-2xl font-bold text-gray-900">
							{filterStatus === 'all' && 'すべてのタスク'}
							{filterStatus === 'pending' && '未完了のタスク'}
							{filterStatus === 'completed' && '完了済みのタスク'}
						</h1>
					</div>
					<Link
						href="/new"
						className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
					>
						<VscAdd className="text-lg" />
						<span>新しいタスク</span>
					</Link>
				</div>

				{/* 統計カード */}
				<div className="grid grid-cols-3 gap-4 mb-6">
					<div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
						<p className="text-sm text-gray-500 mb-1">合計</p>
						<p className="text-3xl font-bold text-gray-800">{allPageCnt}</p>
					</div>
					<div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
						<p className="text-sm text-gray-500 mb-1">未完了</p>
						<p className="text-3xl font-bold text-amber-500">{pendingTasks}</p>
					</div>
					<div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
						<p className="text-sm text-gray-500 mb-1">完了済み</p>
						<p className="text-3xl font-bold text-green-500">{completedTasks}</p>
					</div>
				</div>

				{/* フィルタータブ */}
				<div className="flex gap-2 mb-6">
					{filterItems.map(item => (
						<button
							key={item.status}
							onClick={() => setFilterStatus(item.status)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === item.status
									? 'bg-blue-600 text-white shadow-sm'
									: 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
							}`}
						>
							{item.label}
							<span
								className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
									filterStatus === item.status
										? 'bg-blue-500 text-white'
										: 'bg-gray-100 text-gray-600'
								}`}
							>
								{item.count}
							</span>
						</button>
					))}
				</div>

				{/* タスクリスト */}
				{filteredTasks.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="bg-gray-100 p-5 rounded-full mb-4">
							<BiTask className="text-5xl text-gray-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							{filterStatus === 'all' && 'タスクがありません'}
							{filterStatus === 'pending' && '未完了のタスクはありません'}
							{filterStatus === 'completed' && '完了済みのタスクはありません'}
						</h2>
						<p className="text-gray-500 text-sm mb-6">
							{filterStatus === 'all' && '新しいタスクを追加してみましょう'}
							{filterStatus === 'pending' && 'すべてのタスクが完了しています！'}
							{filterStatus === 'completed' && 'タスクを完了するとここに表示されます'}
						</p>
						{filterStatus === 'all' && (
							<Link
								href="/new"
								className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
							>
								<VscAdd />
								<span>タスクを追加</span>
							</Link>
						)}
					</div>
				) : (
					<div className="space-y-3">
						{filteredTasks.map(task => (
							<TaskCard key={task._id} task={task} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
