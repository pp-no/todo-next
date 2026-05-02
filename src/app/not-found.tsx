import Link from 'next/link';

const NotFoundPage = () => {
	return (
		<div className="h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-900">
			<h1 className="text-8xl font-bold">404</h1>
			<p className="text-2xl font-medium mt-4">ページが見つかりません</p>
			<Link href="/" className="mt-6 text-lg text-blue-600 hover:underline">
				トップに戻る
			</Link>
		</div>
	);
};

export default NotFoundPage;
