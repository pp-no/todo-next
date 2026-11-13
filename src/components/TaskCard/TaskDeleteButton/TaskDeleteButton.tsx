// タスク削除ボタン
'use client';

import { FormState, deleteTask } from '@/actions/task';
import { useActionState } from 'react';
import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { PiTrash } from 'react-icons/pi';

interface TaskDeleteButtonProps {
	id: string;
}

// レンダーのたびに再生成されないようモジュールスコープに置く
const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="btn-icon text-lg disabled:opacity-60"
			aria-label="削除する"
		>
			<PiTrash />
		</button>
	);
};

const TaskDeleteButton: React.FC<TaskDeleteButtonProps> = ({ id }) => {
	const deleteTaskWithId = deleteTask.bind(null, id);
	const initialState: FormState = { error: '' };
	const [state, formAction] = useActionState(deleteTaskWithId, initialState);

	useEffect(() => {
		if (state && state.error !== '') {
			alert(state.error);
		}
	}, [state]);

	return (
		<form action={formAction}>
			<SubmitButton />
		</form>
	);
};

export default TaskDeleteButton;
