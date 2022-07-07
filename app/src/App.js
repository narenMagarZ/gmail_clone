import {Navigate, Outlet, Route} from 'react-router'
import {BrowserRouter as Router,Routes} from 'react-router-dom'
import Login from './component/login/login';
import Signup from './component/signup/signup';
import CheckBox from './component/checkbox/checkbox';
import Home from './component/home/home';
import { createContext,useEffect,useState } from 'react';
import { utils } from './utils';
import NoPageFound from './component/nopagefound/nopagefound';
import ProtectedRoute from './component/protectedroute';

export const UserAuthentication = createContext()
function App() {
  const [isUserAuthenticated,setAuthenticationOfUser] = useState(null)
  function CheckForUserAuthentication(){
      const cookie = document.cookie
      const {isAuthenticated} = utils.parseCookie(cookie)
      setAuthenticationOfUser(()=>isAuthenticated)
  }
  useEffect(CheckForUserAuthentication,[isUserAuthenticated])
  if(isUserAuthenticated !==null || typeof isUserAuthenticated !== 'undefined')
  return (
    <div>
      <UserAuthentication.Provider value={isUserAuthenticated}>
    <Router>
      <Routes>
      <Route path='/login' element={
        isUserAuthenticated ? <Navigate to='/' /> : <Outlet/>
      } >
        <Route path='/login' element={<Login/>} />
      </Route>
      <Route path='/signup' element={
        isUserAuthenticated ? <Navigate to = '/' /> :<Outlet/>
      } >
        <Route path='/signup' element={<Signup/>}/>
      </Route>
      <Route path='/' element={
      <ProtectedRoute>
      </ProtectedRoute>
      } >
      <Route path='/' element={<Home/>} />
      </Route>
      <Route path='*' element={ <NoPageFound/> } />
      <Route />
      </Routes>
      <CheckBox/>
    </Router>
      </UserAuthentication.Provider>
    </div>
  ) 
    }

export default App;
