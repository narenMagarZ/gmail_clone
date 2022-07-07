import { Navigate, Outlet } from "react-router"

export default function PublicRoute({isAuthenticated}){
    return isAuthenticated ? <Navigate to='/' /> : <Outlet/>
}