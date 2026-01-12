"use client"

import { useState, useEffect } from "react"
import { getMockData } from "../../../lib/mock-data"
import PageHeader from "../../../components/page-header"
import PropertiesTable from "../../../components/properties/properties-table"
import AddPropertyModal from "../../../components/properties/add-property-modal"
import { Button } from "../../../components/ui/button"

export default function PropertiesPage() {
  const [data, setData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [properties, setProperties] = useState([])

  useEffect(() => {
    const mockData = getMockData()
    setData(mockData)
    setProperties(mockData.properties)
  }, [])

  const handleAddProperty = (newProperty) => {
    const property = {
      id: properties.length + 1,
      ...newProperty,
    }
    setProperties([...properties, property])
    setShowModal(false)
  }

  if (!data) return <div>Loading...</div>

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Properties"
        description="Manage all your rental properties"
        icon="🏠"
        action={<Button onClick={() => setShowModal(true)}>+ Add Property</Button>}
      />
      <div className="p-6">
        <PropertiesTable properties={properties} data={data} />
      </div>
      {showModal && <AddPropertyModal onClose={() => setShowModal(false)} onAdd={handleAddProperty} />}
    </div>
  )
}
