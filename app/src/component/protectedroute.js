import { useContext } from "react";
import { Navigate , Outlet } from "react-router";
import {UserAuthentication} from '../App'
export default  function ProtectedRoute(){
    const isAuthenticated = useContext(UserAuthentication)
    return isAuthenticated ? <Outlet/> : <Navigate to='/login' />
}