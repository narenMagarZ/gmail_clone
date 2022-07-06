import {Route, useNavigate} from 'react-router'
import {BrowserRouter as Router,Routes} from 'react-router-dom'
import Login from './component/login/login';
import Signup from './component/signup/signup';
import CheckBox from './component/checkbox/checkbox';
import Home from './component/home/home';
import { useEffect, useState } from 'react';
function App() {
  const [isUserAuthenticated,setAuthenticationOfUser] = useState(false)
  function CheckForUserAuthentication(){
    const cookie = document.cookie
    const {isAuthenticated} = ParseCookie(cookie)
    setAuthenticationOfUser(()=>isAuthenticated)
  }
  function ParseCookie(cookie){
    const parsedCookie = cookie.split('; ')
    const cookies = {}
    if(parsedCookie.length > 0){
      for(let c of parsedCookie ){
        const cookiePair = c.split('=')
        const cookieKey = cookiePair[0]
        const cookieValue = cookiePair[1]
        cookies[cookieKey] = cookieValue
      }
    }
    return cookies
  }
  useEffect(CheckForUserAuthentication,[isUserAuthenticated])
  return (
    <div>
    <Router>
      <Routes>
      <Route path='/login' element={<Login isAuthenticated = {isUserAuthenticated} />} /> 
      <Route path='/signup' element={<Signup isAuthenticated = {isUserAuthenticated} />} />
      <Route path='/' element={<Home isAuthenticated = {isUserAuthenticated} /> }/>
      <Route />
      </Routes>
      <CheckBox/>
    </Router>
    </div>
  );
}

export default App;
