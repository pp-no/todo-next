import { FaRegCheckSquare, FaRegClock, FaTasks } from 'react-icons/fa';
import NavItem from './NavItem/NavItem';

interface NavItemType {
	id: number;
	label: string;
	link: string;
	icon: React.ReactNode;
}

const NavList = () => {
	const navList: NavItemType[] = [
		{ id: 1, label: 'すべてのタスク', link: '/', icon: <FaTasks className="size-5" /> },
		{ id: 2, label: '完了済み', link: '/completed', icon: <FaRegCheckSquare className="size-5" /> },
		{ id: 3, label: '期限切れ', link: '/expired', icon: <FaRegClock className="size-5" /> },
	];
	return (
		<div className="space-y-1">
			{navList.map(item => (
				<NavItem key={item.id} label={item.label} link={item.link} icon={item.icon} />
			))}
		</div>
	);
};

export default NavList;
