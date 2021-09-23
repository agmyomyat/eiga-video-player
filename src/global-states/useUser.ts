import create from "zustand";
import { verifyTokenMutation } from "../api/graphql-req/verifyToken-gql-req";

type UserProp = {
	uploader: string;
	verify: boolean;
	accessToken: string;
	setUserVerify: (prop: boolean) => void;
	setUploader: (prop: string) => void;
	checkUser: () => Promise<any>;
	logOut: () => void;
};
export const useUser = create<UserProp>((set, get) => ({
	accessToken: "",
	uploader: "",
	verify: false,
	setUserVerify: (prop: boolean) => set((state) => ({ ...state, verify: prop })),
	setUploader: (prop: string) => set((state) => ({ ...state, uploader: prop })),
	logOut: () => set((state) => ({ ...state, verify: false, uploader: "" })),
	checkUser: async () => {
		try {
			const res = await verifyTokenMutation();
			set((state) => ({
				...state,
				verify: res.verifyToken.verify,
				uploader: res.verifyToken.user,
				accessToken: res.verifyToken.bnet,
			}));
			console.log("state in checkuser ", get().uploader);
			return res;
		} catch (e: any) {
			console.log(e.message);
		}
	},
}));
