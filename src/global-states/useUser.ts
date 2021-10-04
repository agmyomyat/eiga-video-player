import create from "zustand";
import { verifyTokenMutation } from "../api/graphql-req/verifyToken-gql-req";
import { setAccessToken } from "../share/token";

type UserProp = {
	uploader: string;
	verify: boolean;
	accessToken: string;
	setUserVerify: (prop: boolean) => void;
	setUploader: (prop: string) => void;
	checkUser: () => Promise<any>;
	logOut: () => void;
	setAccessToken:(prop:string)=>void
};
export const useUser = create<UserProp>((set, get) => ({
	accessToken: "",
	uploader: "",
	verify: false,
	setAccessToken:(prop:string)=>set((state)=>({...state,accessToken:prop})),
	setUserVerify: (prop: boolean) => set((state) => ({ ...state, verify: prop })),
	setUploader: (prop: string) => set((state) => ({ ...state, uploader: prop })),
	logOut: () =>
		set((state) => {
			setAccessToken("");
			return { ...state, verify: false, uploader: "" };
		}),
	checkUser: async () => {
		try {
			const res = await verifyTokenMutation();
			if(!res.verifyToken.user)get().logOut()
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
