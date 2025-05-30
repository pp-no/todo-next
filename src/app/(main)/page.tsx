// メインページ
import PagiNation from "@/components/PagiNation/PagiNation";
import TaskCard from "@/components/TaskCard/TaskCard";
import { TaskDocument } from "@/models/task";
import Link from "next/link";

import { MdAddTask } from "react-icons/md";
import { TfiMenu } from "react-icons/tfi";

// 非同期タスク一覧取得
const getAllTasks = async (): Promise<TaskDocument[]> => {
  const response = await fetch(`${process.env.API_URL}/tasks`, {cache: 'no-store'})
  
  // リクエスト失敗
  if(response.status !== 200) {
    throw new Error()
  }


  // リクエスト成功
  const data = await response.json()
  return data.tasks as TaskDocument[]

}

export default async function MainPage() {
  const allTasks = await getAllTasks()
  // タスクの件数
  const allPageCnt =  allTasks.length


  return (
    <div className="text-gray-800 p-8 h-full overflow-auto pb-24">
      <header className="flex justify-between items-center">
      <button id="menuBtn" type="button" className="md:hidden text-2xl"><TfiMenu /></button>
        <h1 className="text-2xl font-bold flex items-center">All ToDo</h1>
        <Link href='/new' className="flex items-center gap-1 font-semibold border px-4 py-2 rounded-full shadow-sm text-white bg-gray-800 hover:bg-gray-700">
          <MdAddTask className="size-5"/>
          <div>Add Task</div>
        </Link>
      </header>
      <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
        {allTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>

      <PagiNation allPageCnt={allPageCnt}/>
    </div>
  );
}
