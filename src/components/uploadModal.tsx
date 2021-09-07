import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);
type ModalProps = {open:boolean, handleOpen:Dispatch<SetStateAction<boolean>>,handleClose:Dispatch<SetStateAction<boolean>>}
export const UploadModal = (Children:React.FC)=>{
	const classes = useStyles()
	const [modalStyle] = React.useState(getModalStyle);


	return function wrapper({open,handleOpen,handleClose}:ModalProps){ 
  // getModalStyle is not a pure function, we roll the style only on the first render

  const body = (
    <div style={modalStyle} className={classes.paper}>
    <Children/>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={()=>handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
	
}
}