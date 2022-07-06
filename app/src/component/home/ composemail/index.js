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
    function CalculateFileSize(sizeInByte){
        const sizeType = ['kb','mb','gb']
        let i = 0
        let actualFileSize 
        while(true){
            if( i === 0 && sizeInByte < 1024){
                actualFileSize = sizeInByte + ' byte'
                break
            } 
            sizeInByte = Math.ceil(sizeInByte / 1024)
            if(sizeInByte < 1024 ){
                actualFileSize = sizeInByte + ' ' + sizeType[i]
                break
            }
            i++
       
        } 
        return actualFileSize

    }
    function RemoveFileFromList(ev){
        const itsParent = ev.target.parentElement
        const grandParent = itsParent.parentElement
        if(grandParent){
            const itsParentId = itsParent.dataset.id
            const tempFormData = formData.getAll('files')
            formData.delete('files')
            tempFormData.splice(itsParentId,1)
            for(let i = 0 ; i < tempFormData.length ; i++){
                formData.append('files',tempFormData[i])
            }
            let j = 0
            grandParent.removeChild(itsParent)
            // this can reset the data-id 
            for(let fileWrapper of grandParent.children){
                fileWrapper.setAttribute('data-id',j++)
                
            }    
        }
    }
    function PickFile(e){
        let filePicker = document.getElementById('file-picker')
        if(filePicker){
            if(formData.getAll('files').length > 0) formData.delete('files')
            filePicker.addEventListener('change',AttachFileToUploader)
            function AttachFileToUploader(e){
                    const pickedFiles = e.target.files
                    const fileUploadDisplayWrapper = document.getElementById('file-upload-display-wrapper')
                    let i = 0
                    for (let file of pickedFiles){
                            const fileWrapper = document.createElement('div')
                            fileWrapper.setAttribute('id','file-wrapper')
                            const fileName = document.createElement('span')
                            const fileSize = document.createElement('span')
                            const fileRemover = document.createElement('button')
                            fileRemover.style = "float:right;border:none;background:transparent:outline:none;border-radius:4px;"
                            fileRemover.innerHTML = "❌"
                            fileSize.innerText = '(' + CalculateFileSize(file.size) + ')'
                            fileName.innerText = file.name 
                            fileRemover.addEventListener('click',RemoveFileFromList)
                            fileWrapper.append(fileName)
                            fileWrapper.append(fileSize)
                            fileWrapper.append(fileRemover)
                            fileWrapper.setAttribute('data-id',i++)
                            fileUploadDisplayWrapper.append(fileWrapper)
                            const fileReader = new FileReader()
                            fileReader.readAsDataURL(file)
                            fileReader.onloadend = function(ev){
                                fileName.style.color = "#0000ff"
                            }
                            formData.append('files',file) 
                    }
                    filePicker.removeEventListener('change',AttachFileToUploader)
            }
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
                'height':'auto',
                'overflow':'scroll'
             }}>
                <div id='title-wrapper' style={{
                    'width':'100%',
                }}>
                    <input placeholder='To' ref={receiverRef} />
                </div>
                <div id='subject-wrapper'>
                    <input placeholder='Subject' ref={subjectRef} />
                </div>
                <div style={{
                    'border':'2px solid red'
                }} className='cmp-mail-body-wrapper'>
                     <div id='cmp-mail-in-wrapper'>
                        <div id='cmp-mail-text-wrapper'>
                            <textarea ref={textContentRef}></textarea>
                        </div>
                     </div>
                </div>
             <div id='file-upload-display-wrapper' style={{
                'border':'var(--border)',
                'display':'flex',
                'flexDirection':'column',
                'alignItems':'flex-start',
                'overflowY':'scroll',
                'height':'auto',
             }}>
             </div>
             </div>
             <div style={{
                'borderTop':'1px solid #292929',
                'display':'flex',
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