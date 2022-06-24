import {useEffect} from 'react'
import './login.css'
function Login(){
    function LoginForm(e){
        e.preventDefault()

    }
    function KeyUpHandler(){

    }
    useEffect(()=>{
        ['username-field','phonenum-field','gmail-id-field','password-field','confirm-password-field'].forEach((field)=>{
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