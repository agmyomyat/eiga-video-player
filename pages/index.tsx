import type { NextPage } from "next";
import { UploadPage } from "../src/components/uploadPage";
import { getAccessToken } from "../src/share/token";
import { useRouter } from "next/router";
import { useUser } from "../src/global-states/useUser";
import shallow from "zustand/shallow";
import { useCallback, useEffect } from "react";
const token = getAccessToken();
const Home: NextPage = (prop) => {
	const { replace } = useRouter();
	const { logOut, userVerify, user, userCheck } = useUser(
		useCallback(
			(state) => ({
				logOut: state.logOut,
				userVerify: state.verify,
				user: state.uploader,
				userCheck: state.checkUser,
			}),

			[]
		),
		shallow
	);
	useEffect(() => {
		if (!token) {
			replace("/login");
			return;
		}
		if (!user && token) {
			try {
				console.log("user in index", user);
				userCheck().then((res) => {
					console.log(res);
					if (res.verifyToken.verify) return;
					replace("/login");
				});
			} catch (e: any) {
				console.log(e.message);
			}
		}
	}, [replace, user, userCheck]);
	console.log("this retrigger");
	//Bunch of code...

	return <UploadPage verify={userVerify} />;
};

export default Home;
