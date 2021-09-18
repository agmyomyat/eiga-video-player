import React from "react";
import { styled } from "@mui/system";
import Modal from "@mui/material/Modal";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const WrapperDiv = styled("div")(({ theme }) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 4, 3),
	},
}));

type ModalProps = { open: boolean };

export const UploadModal = (Children: React.FC) => {
	const [modalStyle] = React.useState(getModalStyle);
	// getModalStyle is not a pure function, we roll the style only on the first render

	return function Wrapper({ open }: ModalProps) {
		const body = (
			<WrapperDiv style={modalStyle}>
				<Children />
			</WrapperDiv>
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
