import { Navigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

const VerifyProtectedRoute = ({ children }) => {
  const params = new URLSearchParams(useLocation().search)
  const token = params.get("token")
  const email = params.get("email")

  if (!token || !email) return <Navigate to="/" />

  return children
}
export default VerifyProtectedRoute
