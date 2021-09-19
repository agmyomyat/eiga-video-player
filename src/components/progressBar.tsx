import React, { Dispatch, SetStateAction, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CancelTokenSource } from "axios";
import { Button } from "@mui/material";
import { BorderLinearProgress } from "../material-ui/BoderLinearProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
	return (
		<Box display="flex" alignItems="center">
			<Box width="100%" mr={1}>
				<BorderLinearProgress variant="determinate" {...props} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{`${Math.round(
					props.value
				)}%`}</Typography>
			</Box>
		</Box>
	);
}

const Div = styled("div")({
	width: "100%",
});
type Progress = {
	fileName: string;
	value: number;
	cancelRequest: CancelTokenSource;
	setUploadState: Dispatch<SetStateAction<boolean>>;
};
export default function LinearWithValueLabel({
	fileName,
	value,
	cancelRequest,
	setUploadState,
}: Progress) {
	useEffect(() => {
		return () => console.log("unmounted");
	}, []);

	return (
		<Div>
			<CloudUploadIcon />
			<p>Uploading {fileName}.</p>
			<p>This will auto close after finished.You might wanna grab a coffee</p>
			<LinearProgressWithLabel value={value} />
			<Button
				variant="contained"
				color="secondary"
				onClick={() => {
					console.log("cancel function trigger");
					setUploadState(false);
					cancelRequest.cancel();
				}}
			>
				CANCEL
			</Button>
		</Div>
	);
}
