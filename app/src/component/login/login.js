import {useEffect, useRef, useState} from 'react'
import './login.css'
import { apiFetcher } from '../baseurl'
function Login(){
    
    const keyUpTimer = useRef(null)
    const [formData,setFormData] = useState({
        'gmailId':'',
        'password':''
    }) 
    async function LoginForm(e){
        e.preventDefault()
        const userLoginInfo = {
            ...formData,
            'userId':window.navigator.oscpu
        }
        const response = await apiFetcher.post('/login',userLoginInfo)
        console.log(response)
    }

    function KeyUpHandler(e){
        clearTimeout(keyUpTimer.current)
        keyUpTimer.current = setTimeout(()=>{
            if(e.target.value){                
                setFormData((prevFormData)=>{
                    prevFormData = {
                        ...prevFormData,
                        [e.target.name]:e.target.value,
                    }
                    return prevFormData
                })
            }
        },400)
    }
    useEffect(()=>{
        console.log(window.navigator)
        console.log(formData)
    },[formData])
    useEffect(()=>{
        ['gmail-field','password-field'].forEach((field)=>{
            if(document.getElementById(field)){
                document.getElementById(field).addEventListener('keyup',KeyUpHandler)
            }
        })
    },[])
    return (
        <div className='login'>
              <form onSubmit={LoginForm} id='login-form'>
                <div>
                    <h2>Login</h2>
                </div>
                    <div>
                        <label>Gmail-id : </label>
                        <input name='gmailId' id='gmail-field' />
                    </div>
                    <br />
                    <div>
                        <label>Password : </label>
                        <input name='password' id='password-field' />
                    </div>
                    <br />
                    <div>
                        <button>Login</button>
                    </div>
                </form>
        </div>
    )
}

export default Login