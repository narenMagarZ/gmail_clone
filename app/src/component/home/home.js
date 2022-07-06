import { useEffect } from "react";
import './home.css'
import { apiFetcher } from "../baseurl";
import ComposeMail from "./ composemail";
function Home({isAuthenticated}){
    console.log('done myan')
    useEffect(()=>{
        async function fun(){
            let platformContent
                await require(['platform'], function(platform) {
                    platformContent = platform
                });
                let clientCookie = document.cookie
                const userGmailId = clientCookie.split('=')[1] + '@gmail.com'
                apiFetcher.get(`/emails?id=${userGmailId}`,{
                    headers:{
                        'platform':platformContent.os.family,
                        'appId':platformContent.name,
                        'deviceid' : 'browser'
                    }
                }).then(res=>{
                    console.log(res)
                })
        }
        fun()
    })
    if(isAuthenticated)
    return(
        <div className="home-wrapper">
            <ComposeMail />
        </div>
    )
    else return window.location.replace('/login')
}
export default Home