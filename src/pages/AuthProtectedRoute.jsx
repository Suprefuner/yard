import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const AuthProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.user)

  if (!user._id) return <Navigate to="/" />
  return children
}

export default AuthProtectedRoute
