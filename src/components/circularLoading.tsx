import {
   CircularProgressProps,
   Box,
   CircularProgress,
   circularProgressClasses,
} from '@mui/material'

export default function FacebookCircularProgress(props: CircularProgressProps) {
   return (
      <Box
         display="flex"
         justifyContent="center"
         alignItems="center"
         minHeight="100vh"
      >
         <CircularProgress
            variant="indeterminate"
            sx={{
               position: 'absolute',
               color: (theme) =>
                  theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
               animationDuration: '550ms',
               [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: 'round',
               },
            }}
            size={100}
            thickness={3}
            {...props}
         />
      </Box>
   )
}
