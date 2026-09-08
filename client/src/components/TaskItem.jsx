export default function TaskItem(props) {


    return (
        <tr className="border-t border-white/50 task">
            <td className="px-6 py-4 items-center gap-4 flex gap-1">
                <input type="checkbox" className="border border-gray-300 rounded size-5"/>
                <div>
                    <p className="text font-bold">{props.task.title}</p>
                    <p className="text-sm text-white/65">{props.task.description}</p>
                </div>
            </td>
            <td className="px-6 py-4">{new Date(props.task.createdAt).toLocaleDateString()}</td>
            <td className="px-6 py-4">{props.task.dueDate ? new Date(props.task.dueDate).toLocaleDateString() : 'N/A'}</td>
            <td className="px-6 py-4">{props.task.completedAt ? 'Yes' : 'No'}</td>
        </tr>
    )
}