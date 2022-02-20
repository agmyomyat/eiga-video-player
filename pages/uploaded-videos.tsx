import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'
import {
   getEmbedVideos2Query,
   getEmbedVideosQuery,
} from '../src/api/graphql-req/getEmbedVideos'
import { useUser } from '../src/global-states/useUser'
import axios from 'axios'
import {
   deleteEmbed1Mutate,
   deleteEmbed2Mutate,
} from '../src/api/graphql-req/deleteEmbed'
import SearchBoxComponent from '../src/components/searchbox'
import {
   searchEmbedVideos2Query,
   searchEmbedVideosQuery,
} from '../src/api/graphql-req/searchMovies'

function generate(element: React.ReactElement) {
   return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
         key: value,
      })
   )
}

const Demo = styled('div')(({ theme }) => ({
   backgroundColor: theme.palette.background.paper,
}))

export default function InteractiveList() {
   const [server2, setServer2] = React.useState(false)
   const [embedVideos, setEmbedVideos] = React.useState<any>([])
   const [loading, setLoading] = React.useState(false)
   const [videosRefetch, setVideosRefetch] = React.useState(false)
   const [searchValue, setSearchValue] = React.useState('')
   function onChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
      setSearchValue(e.currentTarget.value)
   }
   React.useEffect(() => {
      const _uploader = useUser.getState().uploader
      if (!searchValue) return
      const timeout = setTimeout(() => {
         if (server2) {
            return searchEmbedVideos2Query({
               movie_name: searchValue,
               uploader: _uploader,
            }).then((res) => {
               if (res.embedVideo2s && res.embedVideo2s)
                  return setEmbedVideos([...res.embedVideo2s])
               setEmbedVideos([])
            })
         }
         return searchEmbedVideosQuery({
            movieName: searchValue,
            uploader: _uploader,
         }).then((res) => {
            if (res.embedVideos && res.embedVideos)
               return setEmbedVideos([...res.embedVideos])
            setEmbedVideos([])
         })
      }, 500)
      return () => clearTimeout(timeout)
   }, [searchValue])
   React.useEffect(() => {
      setEmbedVideos([])
      const checkUser = useUser.getState().checkUser
      setLoading(true)
      checkUser().then(() => {
         const _uploader = useUser.getState().uploader
         console.log('uploaderis', _uploader)
         if (server2) {
            return getEmbedVideos2Query({ uploader: _uploader }).then((res) => {
               setEmbedVideos(
                  res.embedVideo2s
                     ? res.embedVideo2s.length
                        ? [...res.embedVideo2s]
                        : []
                     : []
               )
               setLoading(false)
            })
         }
         getEmbedVideosQuery({ uploader: _uploader }).then((res) => {
            setEmbedVideos(
               res.embedVideos
                  ? res.embedVideos.length
                     ? [...res.embedVideos]
                     : []
                  : []
            )
            setLoading(false)
         })
      })
   }, [videosRefetch, server2])
   function handleDelete(
      movieName: string,
      uploadStatus: boolean,
      id: string | number
   ) {
      const bnetKey = useUser.getState().server1AccessToken
      const bnetKey2 = useUser.getState().server2AccessToken
      const _url = !server2
         ? `https://storage.bunnycdn.com/apidevurn/${movieName}.mp4`
         : `https://storage.bunnycdn.com/container2/${movieName}.mp4`
      if (uploadStatus) {
         return axios
            .delete(_url, {
               headers: {
                  'Content-Type': 'application/octet-stream',
                  AccessKey: server2 ? bnetKey2 : bnetKey,
               },
            })
            .then((res) => {
               if (res.status === 200) {
                  if (!server2) {
                     return deleteEmbed1Mutate({ id: id })
                        .then((res) => {
                           alert(`${movieName} deleted`)
                           setVideosRefetch((prev) => !prev)
                        })
                        .catch((e) => {
                           alert(e.message)
                           setVideosRefetch((prev) => !prev)
                        })
                  } else {
                     return deleteEmbed2Mutate({ id: id })
                        .then((res) => {
                           alert(`${movieName} deleted`)
                           setVideosRefetch((prev) => !prev)
                        })
                        .catch((e) => {
                           alert(e.message)
                           setVideosRefetch((prev) => !prev)
                        })
                  }
               }
            })
            .catch((e) => alert(e.message))
      }
      if (!server2) {
         return deleteEmbed1Mutate({ id: id })
            .then((res) => {
               alert(`${movieName} deleted`)
               setVideosRefetch((prev) => !prev)
            })
            .catch((e) => {
               alert(e.message)
               setVideosRefetch((prev) => !prev)
            })
      } else {
         return deleteEmbed2Mutate({ id: id })
            .then((res) => {
               alert(`${movieName} deleted`)
               setVideosRefetch((prev) => !prev)
            })
            .catch((e) => {
               alert(e.message)
               setVideosRefetch((prev) => !prev)
            })
      }
   }
   if (loading) return <div>Loading...</div>
   return (
      <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
         <SearchBoxComponent value={searchValue} onChange={onChangeSearch} />
         <FormGroup row>
            <FormControlLabel
               control={
                  <Checkbox
                     checked={server2}
                     onChange={(event) => setServer2(event.target.checked)}
                  />
               }
               label="server2"
            />
         </FormGroup>
         <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
               Recents Uploads
            </Typography>
            <Demo>
               <List>
                  {embedVideos && embedVideos.length ? (
                     embedVideos.map((v: any) => (
                        <ListItem
                           key={v.id}
                           secondaryAction={
                              <IconButton
                                 onClick={() => {
                                    let text = `Do you really wanna delete ${
                                       server2 ? v.movie_name : v.movieName
                                    }`
                                    if (confirm(text) == true) {
                                       handleDelete(
                                          server2 ? v.embedLink : v.eigaLink,
                                          server2
                                             ? v.upload_status
                                             : v.uploadStatus,
                                          v.id
                                       )
                                    }
                                 }}
                                 edge="end"
                                 aria-label="delete"
                              >
                                 <DeleteIcon />
                              </IconButton>
                           }
                        >
                           <ListItemAvatar>
                              <Avatar>
                                 <FolderIcon />
                              </Avatar>
                           </ListItemAvatar>
                           <ListItemText
                              primary={`${
                                 server2 ? v.movie_name : v.movieName
                              }- ${v.season ? `S-${v.season}` : ''}${
                                 v.episode ? `E-${v.episode}` : ''
                              }`}
                              secondary={
                                 server2
                                    ? v.upload_status
                                       ? 'upload completed'
                                       : 'upload not completed'
                                    : v.uploadStatus
                                    ? 'upload completed'
                                    : 'upload not completed'
                              }
                           />
                        </ListItem>
                     ))
                  ) : (
                     <h1>Empty</h1>
                  )}
               </List>
            </Demo>
         </Grid>
      </Box>
   )
}
