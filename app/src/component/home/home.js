import { useEffect } from "react";
import { apiFetcher } from "../baseurl";
function Home(){
    useEffect(()=>{
        console.log(document.cookie)
        const cookie = 'naren@gmail.com'
        apiFetcher.get(`/gmails?id=${cookie}`).then(res=>{
            console.log(res)
        })
    })
    return(
        <div>

        </div>
    )
}
export default Home