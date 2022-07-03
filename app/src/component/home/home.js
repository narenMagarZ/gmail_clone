import { useEffect } from "react";
import './home.css'
import { apiFetcher } from "../baseurl";
import ComposeMail from "./ composemail";
function Home(){

    useEffect(()=>{
        async function fun(){
            let platformContent
                console.log(document.cookie)
                const cookie = 'naren@gmail.com'
                await require(['platform'], function(platform) {
                    platformContent = platform
                });
                apiFetcher.get(`/emails?id=${cookie}`,{
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
    return(
        <div className="home-wrapper">
            <ComposeMail />
        </div>
    )
}
export default Home