import TaskCard from '@/components/TaskCard/TaskCard';
import { TaskDocument, TaskModel } from '@/models/task';
import { connectDb } from '@/utils/database';

// 期限切れ判定は実行時の日付に依存するため、静的生成してはならない
export const dynamic = 'force-dynamic';

const getExpiredTasks = async (): Promise<TaskDocument[]> => {
	await connectDb();
	const currentDate = new Date().toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).replace(/\//g, '-');
	const tasks = await TaskModel.find({
		isCompleted: false,
		dueDate: { $lt: currentDate },
	}).sort({ dueDate: 1 }).lean();
	return JSON.parse(JSON.stringify(tasks));
};

const ExpiredTaskPage = async () => {
	const expiredTasks = await getExpiredTasks();
	return (
		<div className="max-w-3xl mx-auto px-6 py-8">
			<h1 className="font-hand text-3xl text-ink mb-6">
				<span className="marker">期限切れのタスク</span>
			</h1>
			{expiredTasks.length === 0 ? (
				<p className="text-ink-soft">期限切れのタスクはありません。</p>
			) : (
				<div className="space-y-3">
					{expiredTasks.map(task => (
						<TaskCard key={task._id} task={task} />
					))}
				</div>
			)}
		</div>
	);
};

export default ExpiredTaskPage;
