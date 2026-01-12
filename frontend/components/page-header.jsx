export default function PageHeader({ title, description, icon, action }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{icon}</span>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
