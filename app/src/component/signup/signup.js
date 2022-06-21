import './signup.css'
function Signup(){
    return (
        <div className='signup'>
                <form id='signup-form'>
                    <div>
                        <label>Username : </label>
                        <input />
                    </div>
                    <br/>
                    <div>
                        <label>Phone-num : </label>
                        <input />
                    </div>
                    <br />
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
                        <label>Confirm-password : </label>
                        <input />
                    </div>
                    <br />
                </form>
        </div>
    )
}

export default Signup