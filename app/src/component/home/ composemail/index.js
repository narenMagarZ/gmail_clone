import {createRef, useRef, useState} from 'react'
import './index.css'
import {apiFetcher} from '../../baseurl'
function ComposeMail(){
    const subjectRef = createRef('')
    const receiverRef = createRef('')
    const [mailTitle,setMailTitle] = useState('New Message')
    const [pickFile,setPickedFile] = useState([null])
    const textContentRef = createRef('')
    const formData = new FormData()
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
            if(formData.get('body')) formData.delete('body')
            formData.append('body',JSON.stringify(mailContent))
            const response = await apiFetcher.post('/composemail',formData,{
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
    function PickFile(e){
        const filePicker = document.getElementById('file-picker')
        if(filePicker){
            if(formData.getAll('files').length > 0) formData.delete('files')
            filePicker.addEventListener('change',(e)=>{
                const pickedFiles = e.target.files
                for (let i of pickedFiles){
                    const fileUploadProgressWrapper= document.getElementById('file-upload-progress-wrapper')
                    if(fileUploadProgressWrapper){
                        const fileReader = new FileReader()
                        fileReader.readAsDataURL(i)
                        fileReader.addEventListener('load',(ev)=>{
                            console.log(ev.target.result,ev.loaded)
                            const percent = (ev.loaded / ev.total) * 100
                            console.log(percent,'finally loaded')
                        })
                        fileReader.addEventListener('loadend',(ev)=>{
                            console.log(ev.loaded,'finally loaded completely')
                        })
                        fileReader.addEventListener('loadstart',(ev)=>{
                            console.log(ev.loaded,'on load start')
                        })
                        fileReader.addEventListener('progress',(ev)=>{
                            console.log(ev.loaded)
                            const percent = (ev.loaded / ev.total ) *100
                            console.log(percent,'on progressing')
                        })
                        formData.append('files',i) 
                    }
                }
            })
            filePicker.click()

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
             <div id='file-upload-progress-wrapper' style={{
                'border':'var(--border)',
             }}>

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
                <input name='file' type="file" hidden id='file-picker' multiple />
                <button onClick={PickFile} style={{
                    'margin':'2px'
                }}>
                    Attach File
                </button>
             </div>
        </div>
    )
}
export default ComposeMail