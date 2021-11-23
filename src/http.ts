import axios, { CancelTokenSource } from "axios";
import { Dispatch, SetStateAction } from "react";

export async function uploadVideo<
   S extends (ProgressEvent: ProgressEvent) => void
>(
   video: string | Blob,
   onUploadProgress: S,
   filename: string,
   CancelRequest: CancelTokenSource,
   accessKey: string
) {
   // const ourRequest = axios.CancelToken.source()

   let config = {
      headers: {
         'Content-Type': 'application/octet-stream',
         AccessKey: accessKey,
      },
      onUploadProgress,
      cancelToken: CancelRequest.token,
   }
   let url = `https://storage.bunnycdn.com/apidevurn/${filename}.mp4`
   if (!video) {
      return
   }
   return axios.put(url, video, config)
   // .then(function (response) {
   // 	alert(response.status === 201 ? "Upload Completed" : response.status);
   // 	setUploadState(false);
   // })
   // .catch(function (error) {
   // 	if (axios.isCancel(error)) {
   // 		return alert("Request canceled");
   // 	}
   // 	throw Error(error);
   // });
}
export async function uploadVideoS2<
   S extends (ProgressEvent: ProgressEvent) => void
>(
   video: string | Blob,
   onUploadProgress: S,
   filename: string,
   CancelRequest: CancelTokenSource,
   accessKey: string
) {
   // const ourRequest = axios.CancelToken.source()

   let config = {
      headers: {
         'Content-Type': 'application/octet-stream',
         AccessKey: accessKey,
      },
      onUploadProgress,
      cancelToken: CancelRequest.token,
   }
   let url = `https://storage.bunnycdn.com/container2/${filename}.mp4`
   if (!video) {
      return
   }
   return axios.put(url, video, config)
   // .then(function (response) {
   // 	alert(response.status === 201 ? "Upload Completed" : response.status);
   // 	setUploadState(false);
   // })
   // .catch(function (error) {
   // 	if (axios.isCancel(error)) {
   // 		return alert("Request canceled");
   // 	}
   // 	throw Error(error);
   // });
}