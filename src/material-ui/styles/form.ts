import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const formStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			maxWidth: 360,
			backgroundColor: theme.palette.background.paper,
		},
		chip: {
			margin: theme.spacing(0.5),
		},
		section1: {
			margin: theme.spacing(3, -3),
		},
		buttonPadding: {
			margin: 2,
		},
		section3: {
			padding: theme.spacing(3, 3, 1),
		},
		tootips: {
			backgroundColor: "red",
			margin: 1,
		},
		customArrow: {
			color: "red",
		},
	})
);
