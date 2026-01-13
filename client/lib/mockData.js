export const mockLandlords = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "+254712345678",
    password_hash: "password123",
    created_at: new Date().toISOString(),
  },
]

export const mockProperties = [
  {
    id: 1,
    name: "Main Building",
    location: "Nairobi, Westlands",
    description: "Modern apartment complex with 10 units",
    landlord_id: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Downtown Apartments",
    location: "Nairobi, CBD",
    description: "Central location with 8 units",
    landlord_id: 1,
    created_at: new Date().toISOString(),
  },
]

export const mockUnits = [
  {
    id: 1,
    unit_number: "Unit 101",
    rent_amount: 15000,
    status: "occupied",
    property_id: 1,
    tenant_id: 1,
    created_at: new Date().toISOString(),
    move_in_date: "2024-01-15",
    move_out_date: null,
  },
  {
    id: 2,
    unit_number: "Unit 102",
    rent_amount: 15000,
    status: "available",
    property_id: 1,
    tenant_id: null,
    created_at: new Date().toISOString(),
    move_in_date: null,
    move_out_date: null,
  },
  {
    id: 3,
    unit_number: "Unit 201",
    rent_amount: 20000,
    status: "occupied",
    property_id: 2,
    tenant_id: 2,
    created_at: new Date().toISOString(),
    move_in_date: "2024-02-01",
    move_out_date: null,
  },
]

export const mockTenants = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "+254722111111",
    id_number: "12345678",
    email: "alice@example.com",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bob Williams",
    phone: "+254722222222",
    id_number: "87654321",
    email: "bob@example.com",
    created_at: new Date().toISOString(),
  },
]

export const mockPayments = [
  {
    id: 1,
    tenant_id: 1,
    amount: 15000,
    mpesa_code: "ABC1D2E3F",
    paid_date: new Date("2024-01-10").toISOString(),
    status: "completed",
  },
  {
    id: 2,
    tenant_id: 2,
    amount: 20000,
    mpesa_code: "XYZ9K8L7M",
    paid_date: new Date("2024-01-12").toISOString(),
    status: "completed",
  },
  {
    id: 3,
    tenant_id: 1,
    amount: 15000,
    mpesa_code: "PQR5V6W7X",
    paid_date: new Date("2024-02-10").toISOString(),
    status: "pending",
  },
]
