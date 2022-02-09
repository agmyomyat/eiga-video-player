/** @type {import('next').NextConfig} */
module.exports = {
   reactStrictMode: true,
   env: {
      API_URL: process.env.API_URL,
      EMBED_URL: process.env.EMBED_URL,
      ENG_EMBED_URL: process.env.ENG_EMBED_URL,
      HLS_URL: process.env.HLS_URL,
   },
   async headers() {
      return [
         {
            // matching all API routes
            source: '/(.*)',
            headers: [
               { key: 'Access-Control-Allow-Credentials', value: 'true' },
               {
                  key: 'Access-Control-Allow-Origin',
                  value: 'https://google.com',
               },
               {
                  key: 'Access-Control-Allow-Methods',
                  value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
               },
               {
                  key: 'Access-Control-Allow-Headers',
                  value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
               },
               {
                  key: 'Access-Control-Expose-Headers',
                  value: 'Content-Disposition',
               },
            ],
         },
      ]
   },
}
