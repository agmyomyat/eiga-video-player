import React, { ChangeEvent, Dispatch, RefObject, SetStateAction, useState } from "react";
import { uuid } from "../helpers/uuid";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Form, Formik, useFormik } from "formik";
import { formSchema } from "../helpers/formValidation";
import { Box, Button, Container, Link, Paper, Tooltip } from "@mui/material";
import UploadFailModal from "../material-ui/uploadFailModal";
import axios, { AxiosResponse } from "axios";
import { uploadEmbedMutation, updateEmbedMutation } from "../api/graphql-req/embed-graphql-req";
import { Copyright } from "@mui/icons-material";
type FormProp<T = () => void> = {
	handleChoose: T;
	source: string;
	clearFile: T;
	handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleUpload: ({ fileName }: { fileName: string }) => Promise<AxiosResponse<any> | undefined>;
	inputRef: RefObject<HTMLInputElement>;
	setUploadState: Dispatch<SetStateAction<boolean>>;
};
export default function UploadForm({
	handleChoose,
	source,
	clearFile,
	handleUpload,
	handleFileChange,
	inputRef,
	setUploadState,
}: FormProp) {
	const [modalMessage, setModalMessage] = useState<string>("");
	return (
		<React.Fragment>
			<Formik
				initialValues={{ movieName: "", season: "", episode: "", file: null }}
				validationSchema={formSchema}
				onSubmit={async (values, { resetForm, setSubmitting }) => {
					const _uuid = uuid();
					setUploadState(true);
					let _checkQuery;
					let _queryError;
					try {
						_checkQuery = await uploadEmbedMutation({
							movieName: values.movieName,
							eigaLink: _uuid,
							uploadStatus: false,
						});
					} catch (e: any) {
						_queryError = e;
						alert(e.message);
					}
					if (_queryError) {
						setModalMessage("Server error Try again later");
						return setUploadState(false);
					}
					console.log("result query", _checkQuery.createEmbedVideo.embedVideo.id);
					try {
						let _mutationResultId = _checkQuery.createEmbedVideo.embedVideo.id;
						const response = await handleUpload({ fileName: _uuid });
						if (response!.status === 201) {
							await updateEmbedMutation({
								id: _mutationResultId,
								movieName: values.movieName,
								eigaLink: _uuid,
								season: parseInt(values.season),
								episode: parseInt(values.episode),
								uploadStatus: true,
								originalLink: response?.config.url,
							});
							setModalMessage("upload completed");
							setUploadState(false);
							resetForm({});
						}
						setUploadState(false);
						resetForm({});
						console.log(response);
					} catch (e: any) {
						if (axios.isCancel(e)) {
							setUploadState(false);
							resetForm({});
							return setModalMessage("Request canceled");
						}
						resetForm({});
						setUploadState(false);
						return setModalMessage(e.message);
					}

					setSubmitting(false);
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
					setFieldValue,
					/* and other goodies */
				}) => (
					<>
						<Grid container component="main" sx={{ height: "100vh" }}>
							<Grid
								item
								xs={false}
								sm={4}
								md={7}
								sx={{
									backgroundImage: "url(https://source.unsplash.com/random)",
									backgroundRepeat: "no-repeat",
									backgroundColor: (t) =>
										t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							/>
							<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
								<Box
									sx={{
										my: 8,
										mx: 4,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Form onSubmit={handleSubmit}>
										<TextField
											value={values.movieName}
											onChange={(e) => {
												handleChange(e);
											}}
											required
											id="movieName"
											name="movieName"
											label="Movie Name"
											fullWidth
											autoComplete="given-name"
											error={!!errors.movieName}
											helperText={errors.movieName}
										/>
										<TextField
											value={values.season}
											onChange={handleChange}
											id="season"
											name="season"
											label="Season"
											autoComplete="Season"
											error={!!errors.season}
											helperText={errors.season}
										/>
										<TextField
											value={values.episode}
											onChange={handleChange}
											id="episode"
											name="episode"
											label="Episode"
											autoComplete="Episode"
											error={!!errors.episode}
											helperText={errors.episode}
										/>

										<Tooltip arrow title={errors.file || ""} open={!!errors.file}>
											<Button
												sx={{ mt: 2, mx: 2 }}
												size="small"
												onClick={() => handleChoose()}
												variant="contained"
												color="primary"
												component="span"
											>
												Choose A File
											</Button>
										</Tooltip>
										<Button
											sx={{ mt: 2, mx: 2 }}
											type="submit"
											size="small"
											variant="contained"
											color="primary"
										>
											upload Video
										</Button>
										<Button
											sx={{ mt: 2, mx: 2 }}
											size="small"
											onClick={() => {
												setFieldValue("file", null);
												clearFile();
											}}
											variant="contained"
											color="secondary"
										>
											Remove Video
										</Button>
										<input
											id="file"
											style={{ display: "none" }}
											name="file"
											ref={inputRef}
											onChange={(e) => {
												setFieldValue("file", e.currentTarget.files);
												console.log("values", values);
												handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
											}}
											type="file"
											accept=".mp4"
											hidden
										/>
									</Form>
								</Box>
								<Box sx={{ my: 3, mx: -3, alignItems: "centre" }}>
									<Grid item xs={12}>
										{source && (
											<Container maxWidth="lg">
												<video height="100%" width="100%" controls src={source} />
											</Container>
										)}
									</Grid>
								</Box>
							</Grid>
						</Grid>
						<UploadFailModal message={modalMessage} handleClose={() => setModalMessage("")} />
					</>
				)}
			</Formik>
		</React.Fragment>
	);
}
