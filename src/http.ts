import axios, { CancelTokenSource } from "axios";
import { Dispatch, SetStateAction } from "react";

export default function uploadVideo<S extends (ProgressEvent:ProgressEvent)=>void>
(video:string|Blob,onUploadProgress:S,filename:string,CancelRequest:CancelTokenSource,setUploadState:Dispatch<SetStateAction<boolean>>){
        // const ourRequest = axios.CancelToken.source()
	
	let config = { headers: {
                    'Content-Type': 'application/octet-stream',
		    'AccessKey':'21819e58-006b-43c9-abcef04139ad-6b07-4469'
                },
		onUploadProgress,
                cancelToken: CancelRequest.token
			
	}
            let url = `https://storage.bunnycdn.com/urnotalone/${filename}.mp4`;
            setUploadState(true)

            axios.put(url, video,config)
                .then(function(response){
			alert(response.status)
                        setUploadState(false)
                })
                .catch(function(error){
                        setUploadState(false)

                        throw Error(error)
                });
}