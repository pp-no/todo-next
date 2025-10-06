// タスクカード
import { TaskDocument } from '@/models/task';
import TaskDeleteButton from './TaskDeleteButton/TaskDeleteButton';
import TaskEditButton from './TaskEditButton/TaskEditButton';
import { FiCalendar } from 'react-icons/fi';

interface TaskCardProps {
	task: TaskDocument;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
	// 期限が近いかどうかをチェック（オプショナル機能）
	const isUrgent = () => {
		if (!task.dueDate || task.isCompleted) return false;
		const dueDate = new Date(task.dueDate);
		const today = new Date();
		const diffTime = dueDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 3 && diffDays >= 0;
	};

	const isOverdue = () => {
		if (!task.dueDate || task.isCompleted) return false;
		const dueDate = new Date(task.dueDate);
		const today = new Date();
		return dueDate < today;
	};

	return (
		<div
			className={`w-full bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
				task.isCompleted
					? 'border-green-100 bg-gradient-to-br from-white to-green-50/30'
					: isOverdue()
					? 'border-red-200 bg-gradient-to-br from-white to-red-50/30'
					: isUrgent()
					? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/30'
					: 'border-gray-100 hover:border-blue-200'
			}`}
		>
			<div className="p-5 sm:p-6">
				{/* ヘッダーセクション */}
				<div className="flex items-start gap-3 mb-3">
					{/* タイトルとステータス */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-3 mb-2">
							<h2
								className={`text-lg font-semibold leading-tight ${
									task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
								}`}
							>
								{task.title}
							</h2>
							<div
								className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full ${
									task.isCompleted
										? 'bg-green-100 text-green-700'
										: 'bg-amber-100 text-amber-700'
								}`}
							>
								{task.isCompleted ? '✓ Done' : 'In Progress'}
							</div>
						</div>

						{/* 説明文 */}
						{task.description && (
							<p
								className={`text-sm leading-relaxed line-clamp-2 ${
									task.isCompleted ? 'text-gray-400' : 'text-gray-600'
								}`}
							>
								{task.description}
							</p>
						)}
					</div>
				</div>

				{/* フッターセクション */}
				<div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
					{/* 期限表示 */}
					<div className="flex items-center gap-4">
						{task.dueDate && (
							<div
								className={`flex items-center gap-1.5 text-sm ${
									task.isCompleted
										? 'text-gray-400'
										: isOverdue()
										? 'text-red-600 font-medium'
										: isUrgent()
										? 'text-amber-600 font-medium'
										: 'text-gray-600'
								}`}
							>
								<FiCalendar className="text-base" />
								<span>{task.dueDate}</span>
								{isOverdue() && !task.isCompleted && (
									<span className="ml-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
										Overdue
									</span>
								)}
								{isUrgent() && !task.isCompleted && (
									<span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
										Urgent
									</span>
								)}
							</div>
						)}
					</div>

					{/* アクションボタン */}
					<div className="flex items-center gap-2">
						<TaskEditButton id={task._id} />
						<TaskDeleteButton id={task._id} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskCard;