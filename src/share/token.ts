export function getAccessToken() {
   if (typeof window !== 'undefined') {
      try {
         return localStorage.getItem('eg258') || ''
      } catch (e: any) {
         console.log(e.message)
      }
   }
   return ''
}
export function setAccessToken(token: string) {
   if (typeof window !== 'undefined') {
      try {
         return localStorage.setItem('eg258', token)
      } catch (e: any) {
         console.log(e.message)
      }
   }
   return ''
}
