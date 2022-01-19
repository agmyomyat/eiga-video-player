import { useState } from 'react'
import axios, { CancelTokenSource } from 'axios'
import fileDownload from 'js-file-download'
import { useRouter, NextRouter } from 'next/router'
import { Box, Typography, LinearProgressWithLabel, Button } from '@mui/material'

let cancelAxioToken: CancelTokenSource

export default function Download() {
   const [progress, setProgress] = useState(0)
   const [modalMessage, setModalMessage] = useState('')
   const [downloading, setDownloading] = useState(false)
   const { query }: NextRouter = useRouter()

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
         <Button onClick={cancelDownload}>Download</Button>
         <Button></Button>
      </Box>
   )
}
