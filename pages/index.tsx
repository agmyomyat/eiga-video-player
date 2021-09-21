import type { NextPage } from "next";
import { UploadPage } from "../src/components/uploadPage";
import { getAccessToken } from "../src/share/token";
import { useRouter } from "next/router";
import { isServer } from "../src/helpers/isServer";
import { verifyTokenMutation } from "../src/api/graphql-req/verifyToken-gql-req";
import { useUser } from "../src/global-states/useUser";
import shallow from "zustand/shallow";
import { useCallback, useEffect } from "react";
const Home: NextPage = (prop) => {
	const { replace } = useRouter();
	const { userVerify, user, userCheck } = useUser(
		useCallback(
			(state) => ({
				userVerify: state.verify,
				user: state.uploader,
				userCheck: state.checkUser,
			}),

			[]
		),
		shallow
	);
	if (!isServer()) {
		const token = getAccessToken();
		if (!token) {
			replace("/login");
		}
	}
	useEffect(() => {
		let _unmount = false;
		if (!user && !_unmount) {
			try {
				userCheck().then((res) => {
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

	return <>{userVerify ? <UploadPage /> : null}</>;
};

export default Home;
