import './login.css'
function Login(){
    return (
        <div className='login'>
              <form id='login-form'>
                    <div>
                        <label>Gmail-id : </label>
                        <input />
                    </div>
                    <br />
                    <div>
                        <label>Password : </label>
                        <input />
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