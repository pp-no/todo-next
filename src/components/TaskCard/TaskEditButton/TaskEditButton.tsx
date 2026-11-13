// タスク編集ボタン

import Link from "next/link"
import { PiPencilSimple } from "react-icons/pi"

interface TaskEditButtonProps {
    id: string

}

const TaskEditButton: React.FC<TaskEditButtonProps> = ({id}) => {
  return (
    <Link href={`/edit/${id}`} className="btn-icon" aria-label="編集する">
        <PiPencilSimple className="text-lg" />
    </Link>
  )
}

export default TaskEditButton
