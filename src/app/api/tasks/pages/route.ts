import { TaskDocument, TaskModel } from "@/models/task"
import { connectDb } from "@/utils/database"

import { NextResponse } from "next/server"

// タスク取得し一覧に表示すためのルートハンドラー
export const GET = async (req:Request) => {
    try {
        await connectDb()
        //const allTasks: TaskDocument[] = await TaskModel.find();
        const { searchParams } = new URL(req.url);
        const pageNumber = searchParams.get('page');

        const page = parseInt(pageNumber ?? '1'); // 取得したいページ (1始まり)
        const pageSize = 2; // 1ページあたりの件数
        const allTasks: TaskDocument[] = await TaskModel.find().sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).exec();


        return NextResponse.json({message: 'タスク取得成功', tasks: allTasks})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: 'タスク取得失敗'},{status: 500})
    }
}

// リクエストごとに実行
export const dynamic = 'force-dynamic'