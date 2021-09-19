import { LinearProgress } from "@mui/material";

import { styled } from "@mui/material";

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	root: {
		height: 10,
		borderRadius: 5,
	},
	colorPrimary: {
		backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],
	},
	bar: {
		borderRadius: 5,
		backgroundColor: "#1a90ff",
	},
}));
