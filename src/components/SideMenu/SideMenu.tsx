import NavList from './NavList/NavList';
import Link from 'next/link';
import { VscAdd } from 'react-icons/vsc';
import { BiTask } from 'react-icons/bi';

const SideMenu = () => {
	return (
		<nav className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 shrink-0">
			{/* ロゴ */}
			<div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
				<div className="bg-blue-600 p-2 rounded-xl">
					<BiTask className="text-white text-xl" />
				</div>
				<h1 className="text-xl font-bold text-gray-900">My ToDo</h1>
			</div>

			{/* ナビゲーション */}
			<div className="flex-1 px-3 py-4 overflow-y-auto">
				<p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">メニュー</p>
				<NavList />
			</div>

			{/* 新規タスクボタン */}
			<div className="px-4 py-4 border-t border-gray-100">
				<Link
					href="/new"
					className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
				>
					<VscAdd className="text-lg" />
					<span>新しいタスク</span>
				</Link>
			</div>
		</nav>
	);
};

export default SideMenu;
