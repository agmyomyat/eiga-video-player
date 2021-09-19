import * as Yup from "yup";
export const formSchema = Yup.object().shape({
	movieName: Yup.string().required("Required"),
	season: Yup.number().typeError("season must be a number"),
	episode: Yup.number().typeError("episode must be a number"),
	file: Yup.mixed()
		.required("Choose A Video")
		.test("is-big-file", "File too big Must not be more than 3-GB", checkIfFilesAreTooBig)
		.test("is-correct-file", "File Must Be Mp4", checkIfFilesAreCorrectType),
});
export function checkIfFilesAreTooBig(files?: File[] | null): boolean {
	let valid = true;
	console.log("filevalid", files);
	if (files) {
		const size = files[0].size / 1024 / 1024;
		if (size > 3000) {
			valid = false;
		}
	}
	return valid;
}

export function checkIfFilesAreCorrectType(files?: File[] | null): boolean {
	let valid = true;
	if (files) {
		if (!["video/mp4"].includes(files[0].type)) {
			valid = false;
		}
	}
	return valid;
}
