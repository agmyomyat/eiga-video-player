import { addListener, launch } from 'devtools-detector'
import { useEffect } from 'react'
// 1. add listener
export default function DevDectecter() {
   useEffect(() => {
      addListener(
         (isOpen) =>
            isOpen && (window.location.href = 'https://embed.eiga.sbs/404')
      )
      // 2. launch detect
      launch()
   }, [])
}
