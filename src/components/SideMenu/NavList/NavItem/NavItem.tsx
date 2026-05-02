'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
	label: string;
	link: string;
	icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ label, link, icon }) => {
	const pathname = usePathname();
	const isActive = pathname === link;
	return (
		<Link
			href={link}
			className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
				isActive
					? 'bg-blue-50 text-blue-700'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			}`}
		>
			<span className={isActive ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>
			<span>{label}</span>
		</Link>
	);
};

export default NavItem;
