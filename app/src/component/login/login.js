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
        let platformContent
        await require(['platform'], function(platform) {
            platformContent = platform
        });
        const userLoginInfo = {
            ...formData,
            'platformId':platformContent.os.family,
            'appId':platformContent.name
        }
        const checkBox = document.getElementById('check-box')
        let activeCheckBox = ''
        apiFetcher.post('/login',userLoginInfo).then(res=>{
            console.log(res.data.status)
            if(res.data.status === true){
                checkBox.classList.add('ok-check-box')
                activeCheckBox = 'ok-check-box'
                checkBox.childNodes[0].innerHTML = res.data.msg
            } else {
                checkBox.classList.add('error-check-box')
                activeCheckBox = 'error-check-box'
                checkBox.childNodes[0].innerHTML = res.data.msg
            }
        }).catch(err=>{
            console.log(err)
        })
        setTimeout(()=>{
            if(checkBox)
            checkBox.classList.remove(activeCheckBox)
        },2000)
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
        },200)
    }
    useEffect(()=>{
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