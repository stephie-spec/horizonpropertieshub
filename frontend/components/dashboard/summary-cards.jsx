import SummaryCard from "./summary-card"

export default function SummaryCards({ data }) {
  const totalUnits = data.units.length
  const occupiedUnits = data.units.filter((u) => u.status === "occupied").length
  const vacantUnits = totalUnits - occupiedUnits

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        icon="🏠"
        title="Total Properties"
        value={data.properties.length}
        trend="+5% from last month"
        color="blue"
      />
      <SummaryCard icon="🚪" title="Total Units" value={totalUnits} trend="Across all properties" color="purple" />
      <SummaryCard
        icon="✓"
        title="Occupied Units"
        value={occupiedUnits}
        trend={`${((occupiedUnits / totalUnits) * 100).toFixed(0)}% occupancy`}
        color="green"
      />
      <SummaryCard
        icon="⚠"
        title="Vacant Units"
        value={vacantUnits}
        trend={`${((vacantUnits / totalUnits) * 100).toFixed(0)}% vacancy`}
        color="red"
      />
    </div>
  )
}
