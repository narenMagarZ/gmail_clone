import { useEffect, useRef, useState } from 'react'
import './signup.css'
import {apiFetcher} from '../baseurl'
function Signup(){
    
    let keyUpTimer = useRef(null)
    const [formData,setFormData] = useState({
        'username':'',
        'phonenum':'',
        'gmailid':'',
        'password':'',
        'confirmpassword':''
    })
    async function Signup(e){
        e.preventDefault()
        const response = await apiFetcher.post('/',formData)
        if(response.status === 200){

        }else {
            
        }
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
                        <input name='username' id='username-field' />
                    </div>
                    <br/>
                    <div>
                        <label>Phone-num : </label>
                        <input name='phonenum' id='phonenum-field' />
                    </div>
                    <br />
                    <div>
                        <label>Gmail-id : </label>
                        <input name='gmailid' id='gmail-id-field' />
                    </div>
                    <br />
                    <div>
                        <label>Password : </label>
                        <input name='password' id='password-field' />
                    </div>
                    <br />
                    <div>
                        <label>Confirm-password : </label>
                        <input name='confirmpassword' id='confirm-password-field' />
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