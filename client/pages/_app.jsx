import "../styles/globals.css"
import { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  )
}

export default MyApp
