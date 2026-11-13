import TaskCard from '@/components/TaskCard/TaskCard';
import { TaskDocument, TaskModel } from '@/models/task';
import { connectDb } from '@/utils/database';

// リクエストのたびに DB を参照する（静的生成されると一覧が更新されない）
export const dynamic = 'force-dynamic';

const getCompletedTasks = async (): Promise<TaskDocument[]> => {
	await connectDb();
	const tasks = await TaskModel.find({ isCompleted: true }).sort({ createdAt: -1 }).lean();
	return JSON.parse(JSON.stringify(tasks));
};

const CompletedTaskPage = async () => {
	const completedTasks = await getCompletedTasks();
	return (
		<div className="max-w-3xl mx-auto px-6 py-8">
			<h1 className="font-hand text-3xl text-ink mb-6">
				<span className="marker">完了済みのタスク</span>
			</h1>
			{completedTasks.length === 0 ? (
				<p className="text-ink-soft">完了済みのタスクはありません。</p>
			) : (
				<div className="space-y-3">
					{completedTasks.map(task => (
						<TaskCard key={task._id} task={task} />
					))}
				</div>
			)}
		</div>
	);
};

export default CompletedTaskPage;
