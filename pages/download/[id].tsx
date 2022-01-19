import { useState } from 'react'
import axios, { CancelTokenSource } from 'axios'
import fileDownload from 'js-file-download'
import { useRouter, NextRouter } from 'next/router'
import { Box, Typography, Button } from '@mui/material'
import LinearProgress, {
   LinearProgressProps,
} from '@mui/material/LinearProgress'

let cancelAxioToken: CancelTokenSource

export default function Download() {
   const [progress, setProgress] = useState(0)
   const [modalMessage, setModalMessage] = useState('')
   const [downloading, setDownloading] = useState(false)
   const { query }: NextRouter = useRouter()

   function LinearProgressWithLabel(
      props: LinearProgressProps & { value: number }
   ) {
      return (
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
               <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
               <Typography
                  variant="body2"
                  color="text.secondary"
               >{`${Math.round(props.value)}%`}</Typography>
            </Box>
         </Box>
      )
   }

   function onDownloadProgress(event: ProgressEvent) {
      setProgress(Math.round((99 * event.loaded) / event.total))
   }

   function cancelDownload() {
      if (cancelAxioToken) cancelAxioToken.cancel()
   }
   async function download() {
      if (cancelAxioToken) {
         cancelAxioToken.cancel()
      }
      cancelAxioToken = axios.CancelToken.source()
      setDownloading(true)
      axios({
         url: `${process.env.EMBED_URL}/${query.id}.mp4`,
         // url: `${process.env.EMBED_URL}/${router.query.id}`,
         method: 'GET',
         cancelToken: cancelAxioToken.token,
         responseType: 'blob', // Important
         onDownloadProgress,
      })
         .then((response) => {
            setDownloading(false)
            fileDownload(response.data, `${query.id}.mp4`)
            setModalMessage('download completed')
         })
         .catch((e) => {
            setDownloading(false)
            setModalMessage('your request cancelled or network error')
            console.error(e.message)
         })
   }
   return (
      <Box>
         <Typography variant="h1">{query.id}</Typography>
         <Typography variant="h3">{modalMessage}</Typography>
         <Typography variant="h2">Name:{query.name}</Typography>
         <LinearProgressWithLabel value={progress} />
         <Button onClick={download}>Download</Button>
         <Button onClick={cancelDownload}>cancel Download</Button>
         <Button></Button>
      </Box>
   )
}
