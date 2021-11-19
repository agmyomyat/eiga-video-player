import React, { ChangeEvent, Dispatch, RefObject, SetStateAction, useState } from "react";
import { uuid } from "../helpers/uuid";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Form, Formik, useFormik } from "formik";
import Switch from '@mui/material/Switch'
import { formSchema } from '../helpers/formValidation'
import {
   Avatar,
   Box,
   Button,
   Container,
   Divider,
   FormControlLabel,
   FormGroup,
   Link,
   Paper,
   Stack,
   Tooltip,
   Typography,
} from '@mui/material'
import UploadFailModal from '../material-ui/uploadFailModal'
import axios, { AxiosResponse } from 'axios'
import {
   uploadEmbedMutation,
   updateEmbedMutation,
} from '../api/graphql-req/embed-graphql-req'
import { useUser } from '../global-states/useUser'
import { deepPurple } from '@mui/material/colors'
import {
   updateEmbedS2Mutation,
   uploadEmbedS2Mutation,
} from '../api/graphql-req/embedS2mutate'

type FormProp<T = () => void> = {
   handleChoose: T
   source: string
   clearFile: T
   handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
   handleUpload: ({
      fileName,
      server2,
   }: {
      fileName: string
      server2: boolean
   }) => Promise<AxiosResponse<any> | undefined>
   inputRef: RefObject<HTMLInputElement>
   setUploadState: Dispatch<SetStateAction<boolean>>
}
export default function UploadForm({
   handleChoose,
   source,
   clearFile,
   handleUpload,
   handleFileChange,
   inputRef,
   setUploadState,
}: FormProp) {
   const [isServer2, setIsServer2] = useState<boolean>(false)
   const [modalMessage, setModalMessage] = useState<string>('')
   const user = useUser.getState().uploader
   const logOut = useUser.getState().logOut
   const handleServerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsServer2(event.target.checked)
   }

   return (
      <React.Fragment>
         <Formik
            initialValues={{
               movieName: '',
               season: '',
               episode: '',
               file: null,
            }}
            validationSchema={formSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
               const _user = useUser.getState().uploader
               console.log('user in submit uplaod', user)
               const _uuid = uuid()
               setUploadState(true)
               let _checkQuery
               let _queryError
               try {
                  if (!isServer2) {
                     _checkQuery = await uploadEmbedMutation({
                        movieName: values.movieName,
                        eigaLink: _uuid,
                        uploadStatus: false,
                        uploader: _user,
                     })
                  }
                  if (isServer2) {
                     console.log('event target is ', isServer2)
                     _checkQuery = await uploadEmbedS2Mutation({
                        movie_name: values.movieName,
                        embedLink: _uuid,
                        upload_status: false,
                        uploader: _user,
                     })
                  }
               } catch (e: any) {
                  _queryError = e
                  alert(e.message)
               }
               if (_queryError) {
                  setModalMessage('Server error Try again later')
                  return setUploadState(false)
               }
               try {
                  let _mutationResultId = isServer2
                     ? _checkQuery.createEmbedVideo2.embedVideo2.id
                     : _checkQuery.createEmbedVideo.embedVideo.id
                  const response = await handleUpload({
                     fileName: _uuid,
                     server2: isServer2,
                  })
                  if (response!.status === 201) {
                     const fileSize = `${(
                        response?.config.data.size /
                        1024 /
                        1024
                     )
                        .toFixed(2)
                        .toString()}-MB`
                     console.log(fileSize)
                     if (!isServer2) {
                        await updateEmbedMutation({
                           id: _mutationResultId,
                           movieName: values.movieName,
                           eigaLink: _uuid,
                           season: parseInt(values.season),
                           episode: parseInt(values.episode),
                           uploadStatus: true,
                           originalLink: response?.config.url,
                           fileSize: fileSize,
                        })
                     }
                     if (isServer2) {
                        await updateEmbedS2Mutation({
                           id: _mutationResultId,
                           movie_name: values.movieName,
                           embedLink: _uuid,
                           season: parseInt(values.season),
                           episode: parseInt(values.episode),
                           upload_status: true,
                           original_link: response?.config.url,
                           video_size: fileSize,
                        })
                     }

                     setModalMessage('upload completed')
                     setUploadState(false)
                     resetForm({})
                  }
                  setUploadState(false)
                  resetForm({})
                  console.log(response)
               } catch (e: any) {
                  if (axios.isCancel(e)) {
                     setUploadState(false)
                     resetForm({})
                     return setModalMessage('Request canceled')
                  }
                  resetForm({})
                  setUploadState(false)
                  return setModalMessage(e.message)
               }

               setSubmitting(false)
            }}
         >
            {({
               values,
               errors,
               touched,
               handleChange,
               handleBlur,
               handleSubmit,
               isSubmitting,
               setFieldValue,
               /* and other goodies */
            }) => (
               <>
                  <Grid container component="main" sx={{ height: '100vh' }}>
                     <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                           backgroundImage:
                              'url(https://source.unsplash.com/random)',
                           backgroundRepeat: 'no-repeat',
                           backgroundColor: (t) =>
                              t.palette.mode === 'light'
                                 ? t.palette.grey[50]
                                 : t.palette.grey[900],
                           backgroundSize: 'cover',
                           backgroundPosition: 'center',
                        }}
                     />
                     <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        component={Paper}
                        elevation={6}
                        square
                     >
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                           <Avatar sx={{ bgcolor: deepPurple[500] }}>
                              {user.charAt(0).toUpperCase()}
                           </Avatar>
                           <Typography variant="h5">{user}</Typography>
                           <Button variant="outlined" onClick={() => logOut()}>
                              LogOut
                           </Button>
                        </Stack>
                        <Box
                           sx={{
                              my: 8,
                              mx: 4,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                           }}
                        >
                           <Form onSubmit={handleSubmit}>
                              <TextField
                                 value={values.movieName}
                                 onChange={(e) => {
                                    handleChange(e)
                                 }}
                                 required
                                 id="movieName"
                                 name="movieName"
                                 label="Movie Name"
                                 fullWidth
                                 autoComplete="given-name"
                                 error={!!errors.movieName}
                                 helperText={errors.movieName}
                              />
                              <TextField
                                 value={values.season}
                                 onChange={handleChange}
                                 id="season"
                                 name="season"
                                 label="Season"
                                 autoComplete="Season"
                                 error={!!errors.season}
                                 helperText={errors.season}
                              />
                              <TextField
                                 value={values.episode}
                                 onChange={handleChange}
                                 id="episode"
                                 name="episode"
                                 label="Episode"
                                 autoComplete="Episode"
                                 error={!!errors.episode}
                                 helperText={errors.episode}
                              />

                              <Stack
                                 direction="row"
                                 divider={
                                    <Divider orientation="vertical" flexItem />
                                 }
                                 spacing={2}
                                 sx={{ mt: 2 }}
                              >
                                 <Tooltip
                                    arrow
                                    title={errors.file || ''}
                                    open={!!errors.file}
                                 >
                                    <Button
                                       sx={{ mt: 2, mx: 2 }}
                                       size="small"
                                       onClick={() => handleChoose()}
                                       variant="contained"
                                       color="primary"
                                       component="span"
                                    >
                                       Choose A File
                                    </Button>
                                 </Tooltip>
                                 <FormGroup>
                                    <FormControlLabel
                                       control={
                                          <Switch
                                             checked={isServer2}
                                             onChange={handleServerChange}
                                          />
                                       }
                                       label="Server2"
                                    />
                                 </FormGroup>
                                 <Button
                                    sx={{ mt: 2, mx: 2 }}
                                    type="submit"
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                 >
                                    upload Video
                                 </Button>
                                 <Button
                                    sx={{ mt: 2, mx: 2 }}
                                    size="small"
                                    onClick={() => {
                                       setFieldValue('file', null)
                                       clearFile()
                                    }}
                                    variant="contained"
                                    color="secondary"
                                 >
                                    Remove Video
                                 </Button>
                              </Stack>
                              <input
                                 id="file"
                                 style={{ display: 'none' }}
                                 name="file"
                                 ref={inputRef}
                                 onChange={(e) => {
                                    setFieldValue('file', e.currentTarget.files)
                                    console.log('values', values)
                                    handleFileChange(
                                       e as React.ChangeEvent<HTMLInputElement>
                                    )
                                 }}
                                 type="file"
                                 accept=".mp4"
                                 hidden
                              />
                           </Form>
                        </Box>
                        <Box sx={{ my: 3, mx: -3, alignItems: 'centre' }}>
                           <Grid item xs={12}>
                              {source && (
                                 <Container maxWidth="lg">
                                    <video
                                       height="100%"
                                       width="100%"
                                       controls
                                       src={source}
                                    />
                                 </Container>
                              )}
                           </Grid>
                        </Box>
                     </Grid>
                  </Grid>
                  <UploadFailModal
                     message={modalMessage}
                     handleClose={() => setModalMessage('')}
                  />
               </>
            )}
         </Formik>
      </React.Fragment>
   )
}
