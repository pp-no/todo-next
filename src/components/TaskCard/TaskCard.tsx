// タスクカード
import { TaskDocument } from '@/models/task';
import TaskDeleteButton from './TaskDeleteButton/TaskDeleteButton';
import TaskEditButton from './TaskEditButton/TaskEditButton';
import { PiCalendarBlank } from 'react-icons/pi';

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
			className={`sketch-card w-full ${
				task.isCompleted
					? 'border-leaf/40'
					: isOverdue()
						? 'border-berry/60'
						: isUrgent()
							? 'border-mustard/70'
							: 'border-ink/15 hover:border-ink/40'
			}`}
		>
			<div className="p-5 sm:p-6">
				{/* ヘッダーセクション */}
				<div className="flex items-start gap-3 mb-3">
					{/* タイトルとステータス */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-3 mb-2">
							<h2
								className={`text-lg font-bold leading-tight ${
									task.isCompleted ? 'text-ink-soft line-through' : 'text-ink'
								}`}
							>
								{task.title}
							</h2>
							<div
								className={`flex-shrink-0 text-xs font-bold px-3 py-1 ${
									task.isCompleted ? 'stamp' : 'chip border-ink/15 text-ink-soft'
								}`}
							>
								{task.isCompleted ? '✓ 完了' : '進行中'}
							</div>
						</div>

						{/* 説明文 */}
						{task.description && (
							<p className="text-sm leading-relaxed line-clamp-2 text-ink-soft">
								{task.description}
							</p>
						)}
					</div>
				</div>

				{/* フッターセクション */}
				<div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t-2 border-ink/10">
					{/* 期限表示 */}
					<div className="flex items-center gap-4">
						{task.dueDate && (
							<div
								className={`flex items-center gap-1.5 text-sm ${
									task.isCompleted
										? 'text-ink-soft'
										: isOverdue()
											? 'text-berry font-bold'
											: isUrgent()
												? 'text-mustard-ink font-bold'
												: 'text-ink-soft'
								}`}
							>
								<PiCalendarBlank className="text-base" />
								<span>{task.dueDate}</span>
								{isOverdue() && !task.isCompleted && (
									<span className="chip ml-1 border-berry bg-berry/10 text-berry">期限切れ</span>
								)}
								{isUrgent() && !task.isCompleted && (
									<span className="chip ml-1 border-mustard bg-mustard/30 text-mustard-ink">
										期限間近
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
