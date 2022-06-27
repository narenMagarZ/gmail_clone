import {useState} from 'react'
import './index.css'

function ComposeMail(){
    const [mailTitle,setMailTitle] = useState('New Message')
    return(
        <div className='compose-mail-wrapper'>
             <div className='compose-mail-headbar'>
                {mailTitle}
             </div>
             <div id='cmp-mail-in-body-wrapper'>
                <div id='receiver-wrapper'>
                    <input placeholder='To' />
                </div>
                <div id='subject-wrapper'>
                    <input placeholder='Subject' />
                </div>
                <div className='compose-mail-body-wrapper'>
                     <div id='compose-mail-in-wrapper'>
                        <div id='cmp-mail-text-wrapper'>
                            <textarea></textarea>
                        </div>
                     </div>
                </div>
             </div>
        </div>
    )
}
export default ComposeMail