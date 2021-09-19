import React from "react";
import { Box, styled } from "@mui/system";
import Modal from "@mui/material/Modal";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

type ModalProps = { open: boolean };

export const UploadModal = (Children: React.FC) => {
	// getModalStyle is not a pure function, we roll the style only on the first render

	return function Wrapper({ open }: ModalProps) {
		const body = (
			<Box sx={style}>
				<Children />
			</Box>
		);

		return (
			<div>
				<Modal
					open={open}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					{body}
				</Modal>
			</div>
		);
	};
};
