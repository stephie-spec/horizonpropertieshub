"use client"

import { useState, useEffect } from "react"
import { getMockData } from "../../../lib/mock-data"
import PageHeader from "../../../components/page-header"
import RentStatementsView from "../../../components/statements/rent-statements-view"

export default function StatementsPage() {
  const [data, setData] = useState(null)
  const [selectedTenant, setSelectedTenant] = useState(null)

  useEffect(() => {
    setData(getMockData())
    if (data && data.tenants.length > 0) {
      setSelectedTenant(data.tenants[0].id)
    }
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader title="Rent Statements" description="View monthly rent summaries for each tenant" icon="📄" />
      <div className="p-6">
        <RentStatementsView data={data} selectedTenantId={selectedTenant} onSelectTenant={setSelectedTenant} />
      </div>
    </div>
  )
}
