import { useEffect } from "react";
import { apiFetcher } from "../baseurl";


function Home(){
    useEffect(()=>{
        apiFetcher.get('/emails').then(res=>{
            console.log(res)
        })
    })
    return(
        <div>

        </div>
    )
}
export default Home