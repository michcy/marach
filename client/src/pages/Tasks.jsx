import {useEffect, useState} from "react";
import {getAllTasks, searchTasks} from "../services/apiClient.js";
import TaskItem from "../components/TaskItem.jsx";
import AddTask from "../components/AddTask.jsx";

export default function Tasks() {
    const [task, setTask] = useState('')
    const [query, setQuery] = useState("")
    const [tasks, setTasks] = useState([])
    const [isSelected, setSelected] = useState(false)
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            await fetchTasks()
            return;
        }
        try {
            await searchTasks(query).then((response) => {
                if (response.status === 200) {
                    setTasks(response.data);
                    setError(null);
                } else {
                    setError(response?.data?.error || "Failed to fetch tasks");
                }
            }).catch((error) => {
                setError(error.response?.data?.error || "An error occurred during registration");
            })
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred during registration");
        }
    }

    const fetchTasks = async () => {
        try {
            await getAllTasks().then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setTasks(response.data);
                    setError(null);
                } else {
                    setError(response?.data?.error || "Failed to fetch tasks");
                }
            }).catch((error) => {
                setError(error.response?.data?.error || "An error occurred during registration");
            })
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred during registration");
        }
    }

    const selectAllTasks = () => {
        const tasks = [...(document.getElementsByClassName("task"))]
        const inputs = tasks.map((task) => task.getElementsByTagName("input")[0]);
        const allChecked = inputs.every((input) => input.checked);
        inputs.forEach((input) => input.checked = !allChecked);
        console.log(allChecked, isSelected);
        setSelected(!allChecked);
    }

    useEffect(() => {
        (async () => {
            await fetchTasks()
        })();
    }, []);

    return (
        <div className="no-repeat bg-cover h-screen bg-[url(img_1.png)]">
            <div
                className="flex py-4 fixed w-full duration-300  border-b transition gap-2 border-white px-6 bg-white/20 backdrop-blur-2xl gap-2">
                <button
                    className="py-2 px-4 border-green-800 border bg-green-200/50 text-green-800 rounded-2xl ">Completed
                </button>
                <button className="py-2 px-4 border-red-800 border bg-red-200/50 text-red-800 rounded-2xl">Delete
                </button>
            </div>
            <div
                className="p-6 text-white pt-24 flex flex-col gap-4 ">

                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold">Tasks</h1>
                    <button className="bg-white text-black px-4 py-2 rounded-2xl">Add Task</button>
                </div>

                <div
                    className="flex flex-col backdrop-blur-2xl bg-white/20 border border-white rounded-2xl gap-2">
                    <form className="flex p-6 pb-0"
                          onSubmit={(e) => handleSearch(e)}
                    >
                        <input
                            className="border outline-none border-white/50 focus:border-white rounded-2xl px-4 py-2 flex-1"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Tasks"
                        />
                    </form>
                    <table className="w-full">
                        <thead>
                        <tr className="p-4">
                            <th className="px-6 flex items-center gap-4 py-4 text-left">
                                <input onClick={(e) => selectAllTasks()} type="checkbox"
                                       className="border accent-indigo-600 hover:accent-indigo-700 border-gray-300 rounded size-5"/>
                                Title & Description
                            </th>
                            <th className="px-6 py-4 text-left">Added</th>
                            <th className="px-6 py-4 text-left">Due At</th>
                            <th className="px-6 py-4 text-left">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks && tasks.map((task) => (
                            <TaskItem key={task.id} task={task}/>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}