'use client';

import { useState, useEffect } from 'react';
import TaskCard from '@/components/TaskCard/TaskCard';
import { TaskDocument } from '@/models/task';
import Link from 'next/link';

import {
	PiPlusBold,
	PiX,
	PiList,
	PiNotePencil,
	PiHouse,
	PiCheckCircle,
	PiClock,
	PiNotebook,
} from 'react-icons/pi';

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
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMenuOpen]);

	const filterItems = [
		{ label: 'すべて', status: 'all' as const, icon: <PiHouse />, count: allPageCnt },
		{ label: '未完了', status: 'pending' as const, icon: <PiClock />, count: pendingTasks },
		{
			label: '完了済み',
			status: 'completed' as const,
			icon: <PiCheckCircle />,
			count: completedTasks,
		},
	];

	return (
		<div className="min-h-screen">
			{/* モバイルサイドメニュー */}
			<div
				className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
					isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
				}`}
			>
				<div className="absolute inset-0 bg-ink/40" onClick={closeMenu} />
				<div
					className={`absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-ink/15 transform transition-transform duration-300 ${
						isMenuOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<div className="p-5">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center rounded-full border border-ink/20 bg-peach p-2">
									<PiNotePencil className="text-ink text-xl" />
								</div>
								<h2 className="font-hand text-2xl text-ink">My ToDo</h2>
							</div>
							<button onClick={closeMenu} className="btn-icon" aria-label="メニューを閉じる">
								<PiX className="text-xl" />
							</button>
						</div>

						<nav className="space-y-1">
							{filterItems.map(item => (
								<button
									key={item.status}
									onClick={() => {
										setFilterStatus(item.status);
										closeMenu();
									}}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${
										filterStatus === item.status
											? 'bg-ink/5 text-ink'
											: 'text-ink-soft hover:bg-paper'
									}`}
								>
									<span className="text-lg">{item.icon}</span>
									<span>{item.label}</span>
									<span className="chip ml-auto border-ink/20 text-ink-soft">{item.count}</span>
								</button>
							))}
						</nav>

						<Link href="/new" onClick={closeMenu} className="btn-primary w-full mt-6">
							<PiPlusBold />
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
							className="btn-icon md:hidden"
							aria-label="メニューを開く"
						>
							<PiList className="text-xl" />
						</button>
						<h1 className="font-hand text-3xl text-ink">
							{filterStatus === 'all' && 'すべてのタスク'}
							{filterStatus === 'pending' && '未完了のタスク'}
							{filterStatus === 'completed' && '完了済みのタスク'}
						</h1>
					</div>
					<Link href="/new" className="btn-primary hidden md:flex">
						<PiPlusBold className="text-lg" />
						<span>新しいタスク</span>
					</Link>
				</div>

				{/* フィルタータブ */}
				<div className="flex gap-1.5 sm:gap-2 mb-6 overflow-x-auto">
					{filterItems.map(item => (
						<button
							key={item.status}
							onClick={() => setFilterStatus(item.status)}
							className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
								filterStatus === item.status
									? 'border-ink/25 bg-card text-ink'
									: 'border-transparent text-ink-soft hover:text-ink'
							}`}
						>
							{item.label}
							<span
								className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-bold ${
									filterStatus === item.status ? 'bg-ink/5 text-ink' : 'bg-ink/5 text-ink-soft'
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
						<div className="flex items-center justify-center rounded-full border border-ink/20 bg-peach p-5 mb-4">
							<PiNotebook className="text-5xl text-ink" />
						</div>
						<h2 className="font-hand text-2xl text-ink mb-2">
							{filterStatus === 'all' && 'タスクがありません'}
							{filterStatus === 'pending' && '未完了のタスクはありません'}
							{filterStatus === 'completed' && '完了済みのタスクはありません'}
						</h2>
						<p className="text-ink-soft text-sm mb-6">
							{filterStatus === 'all' && '新しいタスクを追加してみましょう'}
							{filterStatus === 'pending' && 'すべてのタスクが完了しています！'}
							{filterStatus === 'completed' && 'タスクを完了するとここに表示されます'}
						</p>
						{filterStatus === 'all' && (
							<Link href="/new" className="btn-primary">
								<PiPlusBold />
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
