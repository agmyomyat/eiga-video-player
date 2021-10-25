import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress, {
   CircularProgressProps,
} from '@mui/material/CircularProgress'
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
function CircularProgressWithLabel(
   props: CircularProgressProps & { value: number }
) {
   return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
         <CircularProgress variant="determinate" {...props} />
         <Box
            sx={{
               top: 12,
               left: 0,
               bottom: 0,
               right: 0,
               position: 'absolute',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            <Typography
               variant="caption"
               component="div"
               color="text.secondary"
            >{`${Math.round(props.value)}%`}</Typography>
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
            <>
               <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
               >
                  {message}
               </Typography>
               <Button
                  onClick={() => {
                     handleClose()
                  }}
                  variant="outlined"
                  size="small"
               >
                  Close
               </Button>
            </>
         )
      if (downloading)
         return (
            <>
               <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
               >
                  Downloading... Do Not Close the Window!
               </Typography>
               <CircularProgressWithLabel value={progress} />
               <Button
                  sx={{ ml: matches ? '80%' : 0 }}
                  onClick={() => {
                     cancelDownload()
                     setMessage('Download Cancelled')
                  }}
                  size="small"
                  variant="outlined"
               >
                  Cancel
               </Button>
            </>
         )
      if (confirmDL)
         return (
            <>
               <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
               >
                  Warning!
               </Typography>
               <Typography
                  id="transition-modal-description"
                  sx={{ mt: 2, mb: 3, fontSize: 15 }}
               >
                  If you are ios user, make sure your ios version is 14.8 or
                  higher and we recommend using safari to download.do you want
                  to continue? Do not forget to turn off VPN either.
               </Typography>
               <Stack direction="row" spacing={5}>
                  <Button
                     onClick={() => {
                        download()
                        setConfirmDL(false)
                     }}
                     size="small"
                     variant="outlined"
                  >
                     Download
                  </Button>
                  <Button
                     onClick={() => {
                        handleClose()
                     }}
                     size="small"
                     variant="outlined"
                  >
                     No
                  </Button>
               </Stack>
            </>
         )
      if (!confirmDL && !message)
         return (
            <Stack direction="row" spacing={5}>
               <Button
                  onClick={async () => {
                     await play()
                     handleClose()
                  }}
                  variant="outlined"
                  size="small"
               >
                  Play
               </Button>
               <Button
                  onClick={() => setConfirmDL(true)}
                  variant="outlined"
                  href="#outlined-buttons"
                  size="small"
               >
                  Download- {fileSize}
               </Button>
            </Stack>
         )
      return null
   }

   return (
      <div>
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={open}>
               <Box sx={style}>
                  <Child />
               </Box>
            </Fade>
         </Modal>
      </div>
   )
}
