import { useEffect, useState } from "react"

export default function ShowMails({mail}){
    return(
        <div className="mail-display-wrapper">
            <div className="mail-list-wrapper">
                {
                    mail.length > 0 ? mail.map((m,index)=>{
                        return(
                            <ListMail key={index} mails={m} ></ListMail>
                        )
                    }) : ''
                }
            </div>
        </div>
    )
}


function ListMail({mails}){
    const mailContent = {}
    if(typeof mails === 'object'){
        mailContent['composer'] = mails.composer
        mailContent['receiver'] = mails.receiver
        mailContent['title'] = mails.title
        mailContent['body'] = mails.body
        mailContent['text'] = mailContent['body'].content.text
        mailContent['files'] = mailContent['body'].content.files 
        const date = new Date(mails.createdAt)
        mailContent['createdAt'] = date.toDateString()
        console.log(mailContent['files'])
    }
    // console.log(mailContent['text'])
    return(
        <div className="mail-content-wrapper">
            <div><img alt="" id="user-thumbnail" /></div>
            <div id="mail-text-content-wrapper">
                <span>{mailContent['title']}</span>
                <span>{mailContent['composer']}</span>
                <span>{mailContent['text']}</span>
                <div>
                    {mailContent['files'][0]['fileName']  ? mailContent['files'].map(({fileName},index)=>{
                        return (
                            <div id="mail-file-wrapper" key={index}>
                                <div>
                                    <span>{fileName}</span>
                                </div>
                            </div>
                        )
                    }) : ''}
                </div>
            </div>
            <span id="empty-span-2"></span>
            <div id="mail-composed-date">
                <span>{mailContent['createdAt']}</span>
            </div>
        </div>
    )
}