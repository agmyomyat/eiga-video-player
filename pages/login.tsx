import { useRouter } from "next/router";
import * as React from "react";
import { useEffect } from "react";
import shallow from "zustand/shallow";
import LoginComponent from "../src/components/login";
import { useUser } from "../src/global-states/useUser";
import { isServer } from "../src/helpers/isServer";
import { getAccessToken, setAccessToken } from "../src/share/token";

type ServerAlert = {
	success: boolean;
	fail: boolean;
	message: string;
};
export default function Login() {
	const [serverAlert, setServerAlert] = React.useState<ServerAlert>({
		success: false,
		fail: false,
		message: "",
	});

	const { replace } = useRouter();
	const { setBnet, uploader, userVerify, checkUser, setUserVerify, setUser } =
      useUser(
         React.useCallback(
            (state) => ({
               setUserVerify: state.setUserVerify,
               userVerify: state.verify,
               uploader: state.uploader,
               setUser: state.setUploader,
               checkUser: state.checkUser,
               setBnet: state.setServer1AccessToken,
            }),

            []
         ),
         shallow
      )
	useEffect(() => {
		if (uploader && userVerify) {
			replace("/");
			return;
		}
		if (getAccessToken() && !uploader) {
			checkUser().then(
				(res) => {
					console.log("userVierfiy", res);
				},
				(e) => console.error(e)
			);
		}
	}, [checkUser, replace, uploader, userVerify]);

	return (
		<>
			{!uploader && !getAccessToken() && (
				<LoginComponent
					setVerify={setUserVerify}
					setUser={setUser}
					serverAlert={serverAlert}
					setServerAlert={setServerAlert}
					setBnetToken={setBnet}
				/>
			)}
			{!userVerify && uploader && (
				<div>
					<h1>your account is not verified</h1>
					<button
						onClick={() => {
							setUser("");
							setUserVerify(false);
							setAccessToken("");
						}}
					>
						Log Out
					</button>
				</div>
			)}
		</>
	);
}
