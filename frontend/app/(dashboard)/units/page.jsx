"use client"

import { useState, useEffect } from "react"
import { getMockData } from "../../../lib/mock-data"
import PageHeader from "../../../components/page-header"
import UnitsTable from "../../../components/units/units-table"

export default function UnitsPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(getMockData())
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader title="Units" description="View and manage all rental units" icon="🚪" />
      <div className="p-6">
        <UnitsTable units={data.units} properties={data.properties} />
      </div>
    </div>
  )
}
