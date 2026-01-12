"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function VacancyChart({ data }) {
  const chartData = data.properties.map((prop) => {
    const propUnits = data.units.filter((u) => u.property_id === prop.id)
    const occupied = propUnits.filter((u) => u.status === "occupied").length
    const vacant = propUnits.length - occupied

    return {
      name: prop.name,
      Occupied: occupied,
      Vacant: vacant,
    }
  })

  return (
    <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vacancy Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Occupied" stackId="a" fill="#10b981" />
          <Bar dataKey="Vacant" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
