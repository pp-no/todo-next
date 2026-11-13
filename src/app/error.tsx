'use client';

import Link from 'next/link';

const ErrorPage = () => {
	return (
		<div className="h-screen flex flex-col justify-center items-center bg-paper text-ink">
			<h1 className="font-hand text-6xl text-berry">Error</h1>
			<p className="text-2xl font-bold mt-4">予期しないエラーが発生しました</p>
			<Link href="/" className="mt-6 text-lg text-tomato underline underline-offset-4">
				トップに戻る
			</Link>
		</div>
	);
};

export default ErrorPage;
