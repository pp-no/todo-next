import type { Metadata } from 'next';
import { Yomogi, Zen_Maru_Gothic } from 'next/font/google';
import './globals.css';

const yomogi = Yomogi({
	weight: '400',
	subsets: ['latin'],
	preload: false,
	variable: '--font-yomogi',
});

const zenMaruGothic = Zen_Maru_Gothic({
	weight: ['400', '700'],
	subsets: ['latin'],
	preload: false,
	variable: '--font-zen-maru',
});

export const metadata: Metadata = {
	title: 'ToDo List',
	description: 'create ToDo',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${yomogi.variable} ${zenMaruGothic.variable}`}>{children}</body>
		</html>
	);
}
