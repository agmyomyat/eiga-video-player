import type { NextPage } from "next";
import { UploadPage } from "../src/components/uploadPage";
import { getAccessToken, setAccessToken } from "../src/share/token";
import { useRouter } from "next/router";
import { useUser } from "../src/global-states/useUser";
import shallow from "zustand/shallow";
import { useCallback, useEffect } from "react";
import { RsvpTwoTone } from "@mui/icons-material";
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
		const token = getAccessToken();
		if ((user && !userVerify) || !token) {
			replace("/login");
			return;
		}
		if (!user) {
			try {
				console.log("user in index", user);
				userCheck().then((res) => {
					console.log(res);
					if (!res.verifyToken.user) 
						setAccessToken('')
						replace('/login')
				});
			} catch (e: any) {
				console.log(e.message);
			}
			//Bunch of code...
			console.log("this retrigger");
		}
	}, [replace, user, userCheck, userVerify]);

	return <UploadPage verify={userVerify} />;
};

export default Home;
