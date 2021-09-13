import * as Yup from "yup";
export const formSchema = Yup.object().shape({
	movieName: Yup.string().required("Required"),
	season: Yup.number().typeError("season must be a number"),
	episode: Yup.number().typeError("episode must be a number"),
	file: Yup.mixed()
		.required("Choose A Video")
		.test("is-correct-file", "File Must Be Mp4", checkIfFilesAreTooBig)
		.test("is-big-file", "File Too Big Cannot be More Than 3-GB", checkIfFilesAreCorrectType),
});
export function checkIfFilesAreTooBig(files?: File[] | null): boolean {
	let valid = true;
	console.log("filevalid", files);
	if (files) {
		const size = files[0].size / 1024 / 1024 / 1024;
		if (size > 3) {
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
