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
        console.log(mailContent['files'])
    }
    // console.log(mailContent['text'])
    return(
        <div className="mail-content-wrapper">
            <div><img alt="" id="user-thumbnail" /></div>
            <span id="empty-span-1"></span>
            <div id="mail-text-content-wrapper">
                <span>{mailContent['title']}</span>
                <span>{mailContent['composer']}</span>
                <span>{mailContent['text']}</span>
            </div>
            <span id="empty-span-2"></span>
        </div>
    )
}