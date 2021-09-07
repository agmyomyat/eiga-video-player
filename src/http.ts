import axios, { CancelTokenSource } from "axios";
export default function uploadVideo<T,S extends (ProgressEvent:T)=>void>
(video:string|Blob,onUploadProgress:S,filename:string,CancelRequest:CancelTokenSource){
        // const ourRequest = axios.CancelToken.source()
	
	let config = { headers: {
                    'Content-Type': 'application/octet-stream',
		    'AccessKey':'21819e58-006b-43c9-abcef04139ad-6b07-4469'
                },
		onUploadProgress,
                cancelToken: CancelRequest.token
			
	}
            let url = `https://storage.bunnycdn.com/urnotalone/${filename}.mp4`;

            axios.put(url, video,config)
                .then(function(response){
			alert(response.status)
                })
                .catch(function(error){
		alert(`Error during upload or Request canceled${error}`)

                });
}