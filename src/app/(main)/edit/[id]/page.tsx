import EditTaskForm from '@/components/EditTaskForm/EditTaskForm';
import { TaskDocument, TaskModel } from '@/models/task';
import { connectDb } from '@/utils/database';

const getTask = async (id: string): Promise<TaskDocument> => {
	await connectDb();
	const task = await TaskModel.findById(id).lean();
	return JSON.parse(JSON.stringify(task));
};

const EditTaskPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const task = await getTask(id);
	return (
		<div className="flex flex-col justify-center py-20">
			<EditTaskForm task={task} />
		</div>
	);
};

export default EditTaskPage;
