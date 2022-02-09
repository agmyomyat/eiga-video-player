import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { checkPremiumQuery } from '../api/graphql-req/checkPremium'

export default function useCheckPremium({
   setLoading,
}: {
   setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
   const router: NextRouter = useRouter()
   useEffect(() => {
      if (!router.isReady || router.isFallback) return
      console.log('router readey', router.isReady)
      if (router.isReady && !router.query.token) {
         router.replace('/404')
      }
      checkPremiumQuery(router.query.token as string)
         .then((res) => {
            console.log('result', res)
            if (res.getUserData.premium) {
               setLoading(false)
            } else {
               router.replace('/404')
               return
            }
         })
         .catch((e) => {
            console.log(e.message)
            router.replace('/404')
         })
   }, [router])
}
