/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: false,
	env: {
		API_URL: process.env.API_URL,
	},
};
module.exports = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/e/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://eiga.sbs" },
        ]
      }
    ]
  }
};