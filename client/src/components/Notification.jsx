export default function Notification({ message, type, children }) {
    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'error':
                return 'bg-red-200/50 border-red-800 text-red-800';
            case 'info':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
    return (
        <div className={`p-[min(1rem,5%)] w-full gap-2 items-center flex rounded border ${getBackgroundColor()}`}>
            <p>{children}</p>
            {message}
        </div>
    )
}