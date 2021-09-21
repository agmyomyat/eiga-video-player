import create from "zustand";
import { verifyTokenMutation } from "../api/graphql-req/verifyToken-gql-req";

type UserProp = {
	uploader: string;
	verify: boolean;
	setUserVerify: (prop: boolean) => void;
	setUploader: (prop: string) => void;
	checkUser: () => Promise<any>;
};
export const useUser = create<UserProp>((set) => ({
	uploader: "",
	verify: false,
	setUserVerify: (prop: boolean) => set((state) => ({ ...state, verify: prop })),
	setUploader: (prop: string) => set((state) => ({ ...state, uploader: prop })),
	checkUser: async () => {
		try {
			const res = await verifyTokenMutation();
			set({ verify: await res.verifyToken.verify });
			set({ uploader: await res.verifyToken.user });
			console.log("hey");
			return res;
		} catch (e: any) {
			console.log(e.message);
		}
	},
}));
