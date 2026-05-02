import { TaskDocument, TaskModel } from '@/models/task';
import { connectDb } from '@/utils/database';
import MainPageClient from '@/components/MainPageClient';

const getAllTasks = async (): Promise<TaskDocument[]> => {
	await connectDb();
	const tasks = await TaskModel.find().sort({ createdAt: -1 }).lean();
	return JSON.parse(JSON.stringify(tasks));
};

export default async function MainPage() {
	const allTasks = await getAllTasks();
	return <MainPageClient allTasks={allTasks} />;
}
