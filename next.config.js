/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	env: {
		API_URL: process.env.API_URL,
	},
  async headers() {
    return [
      {
        // matching all API routes
        source: "/e/[id]",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://eiga.sbs" },
        ]
      }
    ]
  }
};