import { useEffect, useState } from "react";
import './home.css'
import { apiFetcher } from "../baseurl";
import ComposeMail from "./ composemail";
import { utils } from "../../utils";
import ShowMails from "./showmails";
function Home(){
    const [mails,setMails] = useState([])
    useEffect(()=>{
        async function fun(){
            let platformContent
                await require(['platform'], function(platform) {
                    platformContent = platform
                });
                let cookie = document.cookie
                const {gmailid} = utils.parseCookie(cookie)
                const userGmailId = gmailid +  '@gmail.com'
                console.log(userGmailId)
                apiFetcher.get(`/emails?id=${userGmailId}`,{
                    headers:{
                        'platform':platformContent.os.family,
                        'appId':platformContent.name,
                        'deviceid' : 'browser'
                    }
                }).then(res=>{
                    console.log(res)
                    const {msg} = res.data
                    console.log(msg)
                    setMails(()=>msg)

                }).catch(err=>{
                    console.error(err)
                })
        }
        fun()
    },[])
    return(
        <div className="home-wrapper">
            <ShowMails mail={mails} />
            <ComposeMail />
        </div>
    )
}
export default Home