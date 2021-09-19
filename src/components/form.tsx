import React, { ChangeEvent, Dispatch, RefObject, SetStateAction, useState } from "react";
import { uuid } from "../helpers/uuid";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Formik, Form } from "formik";
import { formSchema } from "../helpers/formValidation";
import { Button, Container, Tooltip } from "@material-ui/core";
import { formStyles } from "../material-ui/styles/form";
import UploadFailModal from "../material-ui/uploadFailModal";
import axios, { AxiosResponse } from "axios";
import { uploadEmbedMutation, updateEmbedMutation } from "../api/graphql-req/embed-graphql-req";
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
	const classes = formStyles();
	const [modalMessage, setModalMessage] = useState<string>("");
	return (
		<React.Fragment>
			<Typography variant="h6" gutterBottom>
				Fill Movie Infos
			</Typography>
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
					<Form onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={3}>
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
							</Grid>
							<Grid item xs={12} sm={2}>
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
							</Grid>
							<Grid item xs={12}>
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
							</Grid>

							<Grid item xs={12}>
								<Tooltip
									classes={{
										tooltip: classes.tootips,
										arrow: classes.customArrow,
									}}
									arrow
									title={errors.file || ""}
									open={!!errors.file}
								>
									<Button
										className={classes.buttonPadding}
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
									type="submit"
									className={classes.buttonPadding}
									size="small"
									variant="contained"
									color="primary"
								>
									upload Video
								</Button>
								<Button
									className={classes.buttonPadding}
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
							</Grid>
						</Grid>
						<div className={classes.section1}>
							<input
								id="file"
								name="file"
								ref={inputRef}
								style={{ display: "none" }}
								onChange={(e) => {
									setFieldValue("file", e.currentTarget.files);
									console.log("values", values);
									handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
								}}
								type="file"
								accept=".mp4"
							/>
							<Grid item xs={12}>
								{source && (
									<Container maxWidth="lg">
										<video height="100%" width="100%" controls src={source} />
									</Container>
								)}
							</Grid>
							<UploadFailModal message={modalMessage} handleClose={() => setModalMessage("")} />
						</div>
					</Form>
				)}
			</Formik>
			;
		</React.Fragment>
	);
}
