import React, { Dispatch, SetStateAction, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgressProps } from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { CancelTokenSource } from "axios";
import { Button } from "@material-ui/core";
import { BorderLinearProgress } from "../material-ui/BoderLinearProgress";

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

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
});
type Progress = {
	value: number;
	cancelRequest: CancelTokenSource;
	setUploadState: Dispatch<SetStateAction<boolean>>;
};
export default function LinearWithValueLabel({ value, cancelRequest, setUploadState }: Progress) {
	useEffect(() => {
		return () => console.log("unmounted");
	}, []);

	const classes = useStyles();
	return (
		<div className={classes.root}>
			<p>Uploading file.This will auto close after finished.You might wanna grab a coffee</p>
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
		</div>
	);
}
