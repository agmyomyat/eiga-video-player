import React, { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import { formSchema } from "../helpers/formValidation";
import { Button, Container, Tooltip } from "@material-ui/core";
import { formStyles } from "../material-ui/styles/form";
type FormProp<T = () => void> = {
	handleChoose: T;
	source: string;
	handleUpload: T;
	clearFile: T;
	handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
	inputRef: RefObject<HTMLInputElement>;
};
export default function AddressForm({
	handleChoose,
	source,
	handleUpload,
	clearFile,
	handleFileChange,
	inputRef,
}: FormProp) {
	const classes = formStyles();
	return (
		<React.Fragment>
			<Typography variant="h6" gutterBottom>
				Fill Movie Infos
			</Typography>
			<Formik
				initialValues={{ movieName: "", season: "", episode: "", file: null }}
				validationSchema={formSchema}
				onSubmit={(values, { resetForm, setSubmitting }) => {
					handleUpload();
					resetForm({});

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
						</div>
					</Form>
				)}
			</Formik>
			;
		</React.Fragment>
	);
}
