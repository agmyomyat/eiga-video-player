import axios, { CancelTokenSource } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import uploadVideo from "../http";
import LinearWithValueLabel from "../components/progressBar";
import { UploadModal } from "./uploadModal";
import { styled } from "@mui/material";
import UploadForm from "./form";
import { useUser } from "../global-states/useUser";

let cancelToken: CancelTokenSource;

export const UploadPage: React.FC<{ verify: boolean }> = ({ verify }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const videoName = useRef<string>("");
	const [progress, setProgress] = useState<number>(0);
	const [video, setVideo] = useState<string | Blob>("");
	const [source, setSource] = useState<string>("");
	const [uploadState, setUploadState] = useState<boolean>(false);
	
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!inputRef.current || !event.target) {
			throw Error("ref is not assigned");
		}
		console.log("file", event.target.files);
		console.log("refFile", inputRef.current.files![0].name);
		
		if (!event.target.files?.length) return setVideo("");
		if (event.target.files?.length !== 0) {
			const file = event.target.files![0];
			videoName.current = file.name;
			setVideo((event.target.files && event.target.files[0]) || "");
			const url = URL.createObjectURL(file);
			setSource(url);
			console.log("ref", inputRef.current.value);
		}
	};
	
	function onUploadProgress(event: ProgressEvent) {
		setProgress(Math.round((99 * event.loaded) / event.total));
	}
	async function _handleUpload({ fileName }: { fileName: string }) {
		const accessToken = useUser.getState().accessToken;
		if (cancelToken) {
			cancelToken.cancel();
		}
		cancelToken = axios.CancelToken.source();
		if (inputRef.current) {
			inputRef.current.value = "";
			setSource("");
		} else {
			throw Error("inputRef value not found(its not supposed to be empty)");
		}
		return uploadVideo(video, onUploadProgress, fileName, cancelToken, accessToken);
	}

	useEffect(() => {
		console.log(source);
	}, [source]);

	const _handleChoose = () => {
		if (!inputRef.current) {
			throw Error("ref is not assigned");
		}
		inputRef.current.click();
	};

	const _clearFile = () => {
		if (inputRef.current) {
			inputRef.current.value = "";
			setSource("");
			return console.log(inputRef.current);
		} else {
			alert("choose a video first");
		}
	};
	const uploadProgress = () => {
		return (
			<LinearWithValueLabel
				fileName={videoName.current}
				setUploadState={setUploadState}
				cancelRequest={cancelToken}
				value={progress}
			/>
		);
	};
	const UploadModalHOC = UploadModal(uploadProgress);
	if (!verify) return <></>;
	return (
		<HOCDiv>
			{/* <Container> */}
			<UploadForm
				handleFileChange={handleFileChange}
				inputRef={inputRef}
				handleChoose={_handleChoose}
				source={source}
				clearFile={_clearFile}
				handleUpload={_handleUpload}
				setUploadState={setUploadState}
			/>
			{/* </Container> */}

			<UploadModalHOC open={uploadState} />
		</HOCDiv>
	);
};
const HOCDiv = styled("div")(({ theme }) => ({
	progress: {
		width: "100%",
	},
	root: {
		"& > *": {
			margin: theme.spacing(1),
			padding: theme.spacing(1),
		},
	},
}));
