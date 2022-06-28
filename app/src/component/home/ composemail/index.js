import {createRef, useState} from 'react'
import './index.css'
import {apiFetcher} from '../../baseurl'
function ComposeMail(){
    const subjectRef = createRef('')
    const receiverRef = createRef('')
    const [mailTitle,setMailTitle] = useState('New Message')
    const textContentRef = createRef('')

    async function SubmitMail(){
        try{
            console.log(subjectRef.current.value)
            console.log(receiverRef.current.value.length)
            console.log(textContentRef.current.value)
            const mailContent = {
                'mailReceiver' : receiverRef.current.value.trim(),
                'mailTitle' : subjectRef.current.value.trim(),
                'mailSubject' : subjectRef.current.value.trim(),
                'mailBody' : {
                    'textContent' : textContentRef.current.value.trim(),
                    'files':[]
                }
            }
            let platformContent
            await require(['platform'], function(platform) {
                platformContent = platform
            });
            const response = await apiFetcher.post('/composemail',mailContent,{
                headers:{
                    'platform':platformContent.os.family,
                    'appid':platformContent.name,
                    'deviceid' : 'browser'
                }
            })
            console.log(response)
        }
        catch(err){
            console.error(err)
        }
 

    }
    return(
        <div style={{
            'position':'fixed',
            'bottom':'0',
            'right':'20px',
            'border':'var(--inborder)',
            'height':'500px',
            'width':'500px',
            'display':'flex',
            'flexDirection':'column',
            'borderRadius':'4px'
        }}>
             <div  style={{
                'padding':'5px',
                'border':'none',
                'borderBottom':'1px solid #292929'
             }} >
                {mailTitle}
             </div>
             <div style={{
                'padding':'4px 8px',
                'flex':'2',
             }}>
                <div id='title-wrapper' style={{
                    'width':'100%',
                }}>
                    <input placeholder='To' ref={receiverRef} />
                </div>
                <div id='subject-wrapper'>
                    <input placeholder='Subject' ref={subjectRef} />
                </div>
                <div className='cmp-mail-body-wrapper'>
                     <div id='cmp-mail-in-wrapper'>
                        <div id='cmp-mail-text-wrapper'>
                            <textarea ref={textContentRef}></textarea>
                        </div>
                     </div>
                </div>
             </div>
             <div style={{
                'borderTop':'1px solid #292929',
                'display':'flex',
                'alignItems':'center',
                'height':'auto'
             }}>
                <button style={{
                    'margin':'2px'
                }}
                onClick={SubmitMail}
                >
                    Send
                </button>
                <button style={{
                    'margin':'2px'
                }}>
                    Attach File
                </button>
             </div>
        </div>
    )
}
export default ComposeMail