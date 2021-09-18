import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	useMediaQuery,
	useTheme,
} from "@mui/material";
type ModalProp = { message: string; handleClose: () => void };
export default function UploadFailModal({ handleClose, message }: ModalProp) {
	const theme = useTheme();
	const fullWidth = useMediaQuery(theme.breakpoints.down('md'));
	return (
		<div>
			<Dialog
				fullWidth={fullWidth}
				open={!!message}
				onClose={handleClose}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">{"!MESSAGE"}</DialogTitle>
				<DialogContent>
					<DialogContentText>{message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
