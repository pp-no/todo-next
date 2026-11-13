import NavList from './NavList/NavList';
import Link from 'next/link';
import { PiPlusBold, PiNotePencil } from 'react-icons/pi';

const SideMenu = () => {
	return (
		<nav className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-ink/15 shrink-0">
			{/* ロゴ */}
			<div className="flex items-center gap-3 px-6 py-5 border-b border-ink/10">
				<div className="flex items-center justify-center rounded-full border border-ink/20 bg-peach p-2">
					<PiNotePencil className="text-ink text-xl" />
				</div>
				<h1 className="font-hand text-2xl text-ink">My ToDo</h1>
			</div>

			{/* ナビゲーション */}
			<div className="flex-1 px-3 py-4 overflow-y-auto">
				<p className="px-4 font-hand text-sm text-ink-soft mb-2">メニュー</p>
				<NavList />
			</div>

			{/* 新規タスクボタン */}
			<div className="px-4 py-4 border-t-2 border-ink/10">
				<Link href="/new" className="btn-primary w-full">
					<PiPlusBold className="text-lg" />
					<span>新しいタスク</span>
				</Link>
			</div>
		</nav>
	);
};

export default SideMenu;
