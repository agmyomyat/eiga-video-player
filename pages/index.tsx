import type { NextPage } from "next";
import { UploadPage } from "../src/components/uploadPage";
import { getAccessToken } from "../src/share/token";
import { useRouter } from "next/router";
import { isServer } from "../src/helpers/isServer";
import { verifyTokenMutation } from "../src/api/graphql-req/verifyToken-gql-req";
import { useState } from "react";

const Home: NextPage = (prop) => {
	const [user, setUser] = useState(null);
	const { replace } = useRouter();
	if (!isServer()) {
		const token = getAccessToken();
		if (!token) replace("/login");
		verifyTokenMutation().then((res) => {
			if (!res.verifyToken.verify) replace("/login");
			setUser(res.verifyToken.verify);
		});
	}
	return <>{user ? <UploadPage /> : null}</>;
};

export default Home;
