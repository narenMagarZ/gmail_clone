import { useEffect } from "react";
import { apiFetcher } from "../baseurl";
function Home(){

    useEffect(()=>{
        async function fun(){
            let platformContent
                console.log(document.cookie)
                const cookie = 'naren@gmail.com'
                await require(['platform'], function(platform) {
                    platformContent = platform
                });
                apiFetcher.get(`/gmails?id=${cookie}`,{
                    headers:{
                        'platform':platformContent.os.family,
                        'appId':platformContent.name
                    }
                }).then(res=>{
                    console.log(res)
                })
        }
        fun()
    })
    return(
        <div>

        </div>
    )
}
export default Home