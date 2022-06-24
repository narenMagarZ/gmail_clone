import {Route} from 'react-router'
import {BrowserRouter as Router,Routes} from 'react-router-dom'
import Login from './component/login/login';
import Signup from './component/signup/signup';
import CheckBox from './component/checkbox/checkbox';
function App() {
  return (
    <div>
    <Router>
      <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      </Routes>
      <CheckBox />
    </Router>
    </div>
  );
}

export default App;
