import type { AppProps } from "next/app";
import React, { useCallback, useEffect, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import { ThemeProvider, createTheme } from "@mui/material";
// import { useRouter } from "next/router";
// import { useUser } from "../src/global-states/useUser";
// import { isServer } from "../src/helpers/isServer";
// import { getAccessToken } from "../src/share/token";
// import shallow from "zustand/shallow";

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
	console.log("kasdflasdlf");
	// const { user, userCheck } = useUser(
	// 	useCallback(
	// 		(state) => ({
	// 			userVerify: state.verify,
	// 			user: state.uploader,
	// 			userCheck: state.checkUser,
	// 		}),

	// 		[]
	// 	),
	// 	shallow
	// );
	useEffect(() => {
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles && jssStyles.parentElement) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>My page</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</React.Fragment>
	);
}
export default MyApp;
