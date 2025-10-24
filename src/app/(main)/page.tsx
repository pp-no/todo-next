// app/(main)/page.tsx (サーバーコンポーネント)
import { TaskDocument } from '@/models/task';
import MainPageClient from '@/components/MainPageClient';

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

	return <MainPageClient allTasks={allTasks} />;
}