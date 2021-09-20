import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Copyright(props: any) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{"Copyright © "}
			<Link color="inherit" href="https://material-ui.com/">
				Eiga
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}
const Schema = Yup.object().shape({
	userName: Yup.string()
		.required("This field cannot be emptied")
		.min(5, "userName must be more than 5 characters"),
	password: Yup.string().required("This field is required"),
	confirmPassword: Yup.string().when("password", {
		is: (val: string | any[]) => (val && val.length > 0 ? true : false),
		then: Yup.string().oneOf([Yup.ref("password")], "Both password need to be the same"),
	}),
});
export default function SignUp() {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// eslint-disable-next-line no-console
		console.log({
			email: data.get("email"),
			password: data.get("password"),
		});
	};
	return (
		<Formik
			initialValues={{
				userName: "",
				password: "",
				confirmPassword: "",
			}}
			validationSchema={Schema}
			onSubmit={(values, {}) => {
				console.log(values);
			}}
		>
			{({ values, errors, handleSubmit, handleChange, handleBlur }) => {
				return (
					<Container component="main" maxWidth="xs">
						<Box
							sx={{
								marginTop: 8,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component="h1" variant="h5">
								Sign in
							</Typography>
							<Form onSubmit={handleSubmit}>
								<Box component="form" noValidate sx={{ mt: 1 }}>
									<TextField
										value={values.userName}
										onChange={handleChange}
										margin="normal"
										required
										fullWidth
										id="userName"
										label="User Name"
										name="userName"
										autoComplete="email"
										autoFocus
										error={!!errors.userName}
										helperText={errors.userName}
									/>
									<TextField
										value={values.password}
										onChange={handleChange}
										margin="normal"
										required
										fullWidth
										name="password"
										label="Password"
										type="password"
										id="password"
										autoComplete="current-password"
										error={!!errors.password}
										helperText={errors.password}
									/>
									<TextField
										value={values.confirmPassword}
										onChange={handleChange}
										margin="normal"
										required
										fullWidth
										name="confirmPassword"
										label="Confirm Password"
										type="password"
										id="confirmPassword"
										autoComplete="current-password"
										error={!!errors.confirmPassword}
										helperText={errors.confirmPassword}
									/>
									<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
										Sign In
									</Button>
									<Grid container>
										<Grid item xs>
											<Link href="#" variant="body2">
												Forgot password?
											</Link>
										</Grid>
										<Grid item>
											<Link href="#" variant="body2">
												{"Don't have an account? Sign Up"}
											</Link>
										</Grid>
									</Grid>
								</Box>
							</Form>
						</Box>
						<Copyright sx={{ mt: 8, mb: 4 }} />
					</Container>
				);
			}}
		</Formik>
	);
}

