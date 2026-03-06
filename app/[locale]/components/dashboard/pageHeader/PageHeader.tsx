export default function PageHeader({ title, description }: { title: string, description: string }) {
    return (
        <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    )
}