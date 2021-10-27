import * as React from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Paper from '@mui/material/Paper'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import DownloadIcon from '@mui/icons-material/Download'
import { alpha } from '@mui/material/styles'
import LinearProgress, {
   LinearProgressProps,
} from '@mui/material/LinearProgress'
import { Stack, useMediaQuery } from '@mui/material'
const style = {
   position: 'absolute' as 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 'auto',
   bgcolor: 'background.paper',
   boxShadow: 24,
   p: 4,
}
function LinearProgressWithLabel(
   props: LinearProgressProps & { value: number }
) {
   return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
         <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" {...props} />
         </Box>
         <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
               props.value
            )}%`}</Typography>
         </Box>
      </Box>
   )
}

export default function OnPlayerModal({
   downloading,
   cancelDownload,
   message,
   open,
   setOpen,
   progress,
   setMessage,
   download,
   fileSize,
   play,
}: {
   downloading: boolean
   cancelDownload: () => void
   download: () => void
   setMessage: React.Dispatch<React.SetStateAction<string>>
   message: string
   open: boolean
   setOpen: React.Dispatch<React.SetStateAction<boolean>>
   progress: number
   fileSize: string
   play: () => Promise<void> | undefined
}) {
   const [confirmDL, setConfirmDL] = React.useState(false)
   const handleClose = () => {
      return setOpen(false), setMessage(''), setConfirmDL(false)
   }
   function Child() {
      const matches = useMediaQuery('(min-width:600px)')
      if (message)
         return (
            <Alert
               severity="info"
               onClose={() => {
                  handleClose()
               }}
            >
               <AlertTitle>{message}</AlertTitle>
            </Alert>
         )
      if (downloading)
         return (
            <Alert severity="info">
               <AlertTitle>Downloading... Do Not Close the Window!</AlertTitle>
               <Box py={1} pb={{ sm: 2 }}>
                  <LinearProgressWithLabel value={progress} />
               </Box>
               <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  mr={2}
               >
                  <Button
                     onClick={() => {
                        cancelDownload()
                        setMessage('Download Cancelled')
                     }}
                     size="small"
                     variant="contained"
                  >
                     cancel
                  </Button>
               </Box>
            </Alert>
         )
      if (confirmDL)
         return (
            <Alert
               // variant="filled"
               severity="warning"
               sx={{
                  overflow: 'auto',
                  width: 1,
                  maxHeight: 150,
                  // py: { sm: 3 },
               }}
            >
               <Box>
                  <Typography
                     id="transition-modal-description"
                     variant={`${matches ? 'body1' : 'caption'}`}
                  >
                     If you are ios user, make sure your ios version is 14.8 or
                     higher and we recommend using safari to download. Do you
                     want to continue? Do not forget to turn off VPN either.
                  </Typography>
               </Box>
               <Box
                  sx={{
                     py: {
                        xs: 1,
                        sm: 2,
                     },
                  }}
               >
                  <Button
                     onClick={() => {
                        handleClose()
                     }}
                     size="small"
                     variant="outlined"
                     color="warning"
                     sx={{
                        mr: 2,
                     }}
                  >
                     cancel
                  </Button>
                  <Button
                     onClick={() => {
                        download()
                        setConfirmDL(false)
                     }}
                     size="small"
                     variant="contained"
                     color="warning"
                  >
                     Download
                  </Button>
               </Box>
            </Alert>
         )
      if (!confirmDL && !message)
         return (
            <>
               <IconButton
                  onClick={async () => {
                     await play()
                     handleClose()
                  }}
                  // size="large"
                  // color="primary"
               >
                  <PlayArrowIcon
                     sx={{
                        fontSize: (theme) => theme.typography.h1.fontSize,
                        color: (theme) => theme.palette.common.white,
                        bgcolor: (theme) => theme.palette.common.black,
                        borderRadius: '50%',
                     }}
                  />
               </IconButton>
               <Box position="absolute" bottom="5%" right="5%">
                  <IconButton
                     onClick={() => setConfirmDL(true)}
                     color="primary"
                  >
                     <DownloadIcon
                        sx={{
                           fontSize: (theme) => theme.typography.h3.fontSize,
                        }}
                     />
                  </IconButton>
               </Box>
            </>
         )
      return null
   }

   return (
      <>
         {open && (
            <Paper
               sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  zIndex: 1000,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // bgcolor: 'transparent',
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.85),
               }}
               elevation={0}
            >
               <Fade in={open}>
                  <Box
                     sx={{
                        p: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}
                  >
                     <Child />
                  </Box>
               </Fade>
            </Paper>
         )}
      </>
   )
}
