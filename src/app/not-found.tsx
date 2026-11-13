import Link from 'next/link';

const NotFoundPage = () => {
	return (
		<div className="h-screen flex flex-col justify-center items-center bg-paper text-ink">
			<h1 className="font-hand text-8xl text-tomato">404</h1>
			<p className="text-2xl font-bold mt-4">ページが見つかりません</p>
			<Link href="/" className="mt-6 text-lg text-tomato underline decoration-wavy">
				トップに戻る
			</Link>
		</div>
	);
};

export default NotFoundPage;
