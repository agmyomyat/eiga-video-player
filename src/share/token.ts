export function getAccessToken() {
	if (typeof window !== "undefined") {
		return localStorage.getItem("eg258") || "";
	}
	return "";
}
export function setAccessToken(token: string) {
	if (typeof window !== "undefined") {
		return localStorage.setItem("eg258", token);
	}
	return "";
}
