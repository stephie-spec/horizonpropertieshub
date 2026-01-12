export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount)
}

export function formatPhoneNumber(phone) {
  return phone.replace(/(\+254)(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4")
}
