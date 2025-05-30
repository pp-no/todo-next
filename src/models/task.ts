// DBタスクの定義
import mongoose, { Document } from "mongoose"

export interface Task {
    title: string
    description: string
    dueDate: string
    isCompleted: boolean
}

// タスク、ドキュメントインタフェース（型リファクタリング）
export interface TaskDocument extends Task, Document {
    _id: string
    createdAt: Date
    updatedAt: Date

}

// スキーマ定義(型をパラメータとして渡せる)
const taskSchema = new mongoose.Schema<TaskDocument>({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
    },
    dueDate: {
        type: String,
        required: true,

    },
    isCompleted: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

// モデルの作成(モデルがある場合。タスクモデルが存在しない場合新しくモデルを作成する)
export const TaskModel = mongoose.models.Task || mongoose.model('Task', taskSchema)