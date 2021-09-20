import axios, { CancelTokenSource } from "axios";
import { Dispatch, SetStateAction } from "react";

export default async function uploadVideo<S extends (ProgressEvent: ProgressEvent) => void>(
	video: string | Blob,
	onUploadProgress: S,
	filename: string,
	CancelRequest: CancelTokenSource,
	accessKey: string
) {
	// const ourRequest = axios.CancelToken.source()

	let config = {
		headers: {
			"Content-Type": "application/octet-stream",
			AccessKey: "12ab3bfc-aa6f-429e-b7c678fd7058-5596-4949",
		},
		onUploadProgress,
		cancelToken: CancelRequest.token,
	};
	let url = `https://storage.bunnycdn.com/apidevurn/${filename}.mp4`;
	if (!video) {
		return;
	}
	return axios.put(url, video, config);
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
