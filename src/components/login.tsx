import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Container, Avatar, Typography, TextField, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Formik, Form, replace } from "formik";
import React, { useEffect } from "react";
import { loginEmbedMutation } from "../api/graphql-req/signIn-gql-req";
import { setAccessToken } from "../share/token";
import { useRouter } from "next/router";
function ServerMessage({
	success,
	fail,
	message,
}: {
	success: boolean;
	fail: boolean;
	message: string;
}) {
	return (
		<>
			{success && (
				<Stack sx={{ width: "100%" }} spacing={2}>
					<Alert severity="success">{message}</Alert>
				</Stack>
			)}
			{fail && (
				<Stack sx={{ width: "100%" }} spacing={2}>
					<Alert severity="error">{message}</Alert>
				</Stack>
			)}
		</>
	);
}

function Copyright(props: any) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{"Copyright © "}
			<Link color="inherit" href="/">
				Eiga Cloud
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}
const Schema = Yup.object().shape({
	userName: Yup.string().required("This field cannot be emptied"),

	password: Yup.string().required("This field is required"),
});
type LoginProps = {
	setServerAlert: React.Dispatch<React.SetStateAction<ServerAlert>>;
	serverAlert: ServerAlert;
	setVerify: (prop: boolean) => void;
	setUser: (prop: string) => void;
};
type ServerAlert = {
	success: boolean;
	fail: boolean;
	message: string;
};
export default function LoginComponent({
	setServerAlert,
	serverAlert,
	setVerify,
	setUser,
}: LoginProps) {
	return (
		<Formik
			initialValues={{
				userName: "",
				password: "",
			}}
			validationSchema={Schema}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				setSubmitting(true);
				const _serverResult = await loginEmbedMutation({
					userName: values.userName,
					password: values.password,
				});
				console.log(_serverResult);
				const res = _serverResult.loginEmbedUploader;
				if (res.statusCode === 200) {
					console.log("this is not supo");
					setAccessToken(res.jwt);
					resetForm({});
					setSubmitting(false);
					setServerAlert({
						...serverAlert,
						success: true,
						fail: false,
						message: _serverResult.loginEmbedUploader.status,
					});
					setUser(res.userName);
					return setVerify(res.verify);
				}
				setSubmitting(false);
				return setServerAlert({
					...serverAlert,
					success: false,
					fail: true,
					message: "Wrong username or password",
				});
			}}
		>
			{({ values, errors, handleChange, submitForm, isSubmitting }) => {
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
								Sign In
							</Typography>
							<ServerMessage
								success={serverAlert.success}
								fail={serverAlert.fail}
								message={serverAlert.message}
							/>
							<Form>
								<Box sx={{ mt: 1 }}>
									<TextField
										value={values.userName}
										onChange={(e) => {
											handleChange(e);
											setServerAlert({
												fail: false,
												success: false,
												message: "",
											});
										}}
										margin="normal"
										required
										fullWidth
										id="userName"
										label="User Name"
										name="userName"
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
										error={!!errors.password}
										helperText={errors.password}
									/>
									<LoadingButton
										loading={isSubmitting}
										onClick={submitForm}
										fullWidth
										variant="contained"
										sx={{ mt: 3, mb: 2 }}
									>
										Sign In
									</LoadingButton>
									<Grid container>
										<Grid item xs>
											<Link href="#" variant="body2">
												Forgot password?
											</Link>
										</Grid>
										<Grid item>
											<Link href="/SignUp" variant="body2">
												{"Not have an account? Sign Up"}
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
