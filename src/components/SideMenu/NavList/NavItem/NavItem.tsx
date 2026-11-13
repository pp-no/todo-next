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
			className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-colors ${
				isActive ? 'bg-ink/5 text-ink' : 'text-ink-soft hover:bg-card hover:text-ink'
			}`}
		>
			<span className={isActive ? 'text-ink' : 'text-ink-soft'}>{icon}</span>
			<span>{label}</span>
		</Link>
	);
};

export default NavItem;
