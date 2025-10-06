// メインページ
import PagiNation from '@/components/PagiNation/PagiNation';
import TaskCard from '@/components/TaskCard/TaskCard';
import { TaskDocument } from '@/models/task';
import Link from 'next/link';

import { VscAdd } from 'react-icons/vsc';
import { TfiMenu } from 'react-icons/tfi';
import { BiTask } from 'react-icons/bi';

// 非同期タスク一覧取得
const getAllTasks = async (): Promise<TaskDocument[]> => {
	const response = await fetch(`${process.env.API_URL}/tasks`, { cache: 'no-store' });

	// リクエスト失敗
	if (response.status !== 200) {
		throw new Error();
	}

	// リクエスト成功
	const data = await response.json();
	return data.tasks as TaskDocument[];
};

export default async function MainPage() {
	const allTasks = await getAllTasks();
	const allPageCnt = allTasks.length;

	// 完了・未完了タスクのカウント
	const completedTasks = allTasks.filter(task => task.isCompleted).length;
	const pendingTasks = allPageCnt - completedTasks;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* ヘッダー */}
				<header className="mb-8">
					<div className="flex justify-between items-center mb-6">
						<button
							id="menuBtn"
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
								My Tasks
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
					{allTasks.length === 0 ? (
						// タスクが0件の場合のEmptyステート
						<div className="flex flex-col items-center justify-center py-16 sm:py-24">
							<div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full mb-6">
								<BiTask className="text-5xl sm:text-6xl text-blue-600" />
							</div>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
								No tasks yet
							</h2>
							<p className="text-gray-600 text-center mb-6 px-4">
								Get started by creating your first task
							</p>
							<Link
								href="/new"
								className="flex items-center gap-2 font-semibold px-6 py-3 rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-xl hover:scale-105"
							>
								<VscAdd className="text-xl" />
								<span>Create First Task</span>
							</Link>
						</div>
					) : (
						<div className="space-y-3 sm:space-y-4">
							{allTasks.map(task => (
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

				{/* ページネーション（必要に応じてコメント解除） */}
				{/* {allPageCnt > 0 && (
					<div className="mt-8">
						<PagiNation allPageCnt={allPageCnt} />
					</div>
				)} */}
			</div>
		</div>
	);
}