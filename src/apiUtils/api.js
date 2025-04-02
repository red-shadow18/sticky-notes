import axios from "axios";

const newAbortSignal=(timeoutInMs)=>{
    const abortController=new AbortController
    setTimeout(()=>{
        abortController.abort()
    },(timeoutInMs || 10000))

    return abortController.signal()
}

const api=async(URL,timeout)=>{
    
}