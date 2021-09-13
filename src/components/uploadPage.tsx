import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios, { CancelTokenSource } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import uploadVideo from "../http";
import LinearWithValueLabel from "../components/progressBar";
import { UploadModal } from "./uploadModal";
import { Container } from "@material-ui/core";
import SignIn from "./form";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		progress: {
			width: "100%",
		},
		root: {
			"& > *": {
				margin: theme.spacing(1),
				padding: theme.spacing(1),
			},
		},
		input: {
			display: "none",
		},
	})
);

let cancelToken: CancelTokenSource;

export const UploadPage: React.FC = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [progress, setProgress] = useState<number>(0);
	const [video, setVideo] = useState<string | Blob>("");
	const [source, setSource] = useState<string>();
	const [uploadState, setUploadState] = useState<boolean>(false);

	const classes = useStyles();
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!inputRef.current || !event.target) {
			throw Error("ref is not assigned");
		}

		if (event.target.files?.length !== 0) {
			const file = event.target.files![0];
			setVideo((event.target.files && event.target.files[0]) || "");
			const url = URL.createObjectURL(file);
			setSource(url);
			console.log("ref", inputRef.current.value);
		}
	};

	function onUploadProgress(event: ProgressEvent) {
		setProgress(Math.round((100 * event.loaded) / event.total));
	}

	const _handleUpload = () => {
		if (cancelToken) {
			cancelToken.cancel();
		}
		cancelToken = axios.CancelToken.source();
		uploadVideo(video, onUploadProgress, "amm", cancelToken, setUploadState);
		if (inputRef.current) {
			inputRef.current.value = "";
			setSource("");
		} else {
			throw Error("inputRef value not found(its not supposed to be empty)");
		}
	};

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
				setUploadState={setUploadState}
				cancelRequest={cancelToken}
				value={progress}
			/>
		);
	};
	const UploadModalHOC = UploadModal(uploadProgress);
	return (
		<div className={classes.root}>
			<input
				ref={inputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
				type="file"
				accept=".mp4"
			/>
			<Container>
				<SignIn />
				<Button
					onClick={() => _handleChoose()}
					variant="contained"
					color="primary"
					component="span"
				>
					Choose A File
				</Button>
			</Container>
			{source && (
				<Container maxWidth="md">
					<video height="100%" width="100%" controls src={source} />
					<Button onClick={_handleUpload} variant="contained" color="primary">
						upload Video
					</Button>
					<Button onClick={_clearFile} variant="contained" color="secondary">
						Remove Video
					</Button>
				</Container>
			)}
			<UploadModalHOC open={uploadState} />
		</div>
	);
};
