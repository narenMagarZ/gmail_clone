import { useEffect, useRef, useState } from 'react'
import './signup.css'
import {apiFetcher} from '../baseurl'
function Signup(){
    let keyUpTimer = useRef(null)
    const [formData,setFormData] = useState({
        'userName':'',
        'phoneNum':'',
        'gmailId':'',
        'password':'',
        'confirmPassword':''
    })
    async function Signup(e){
            e.preventDefault()
            const checkBox = document.getElementById('check-box')
            let activeCheckBox = ''
            const userInfo = {...formData,'userId':window.navigator.oscpu}
            apiFetcher.post('/signup',userInfo).then(res=>{
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
                console.error(err)
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
        ['username-field','phonenum-field','gmail-id-field','password-field','confirm-password-field'].forEach((field)=>{
            if(document.getElementById(field)){
                document.getElementById(field).addEventListener('keyup',KeyUpHandler)
            }
        })
    },[])
    return (
        <div className='signup'>
                <form onSubmit={Signup} id='signup-form'>
                    <div>
                        <h2>Signup</h2>
                    </div>
                    <div>
                        <label>Username : </label>
                        <input name='userName' id='username-field' />
                    </div>
                    <br/>
                    <div>
                        <label>Phone-num : </label>
                        <input name='phoneNum' id='phonenum-field' />
                    </div>
                    <br />
                    <div>
                        <label>Gmail-id : </label>
                        <input name='gmailId' id='gmail-id-field' />
                    </div>
                    <br />
                    <div>
                        <label>Password : </label>
                        <input name='password' id='password-field' />
                    </div>
                    <br />
                    <div>
                        <label>Confirm-password : </label>
                        <input name='confirmPassword' id='confirm-password-field' />
                    </div>
                    <br />
                    <div>
                        <button>Signup</button>
                    </div>
                </form>
        </div>
    )
}

export default Signup