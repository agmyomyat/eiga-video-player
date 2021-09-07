import React, { useEffect} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  const top = 50 
  const left = 50 

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
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

type ModalProps = {open:boolean}

export const UploadModal = (Children:React.FC)=>{
	const classes = useStyles()
	const [modalStyle] = React.useState(getModalStyle);
 

	return function Wrapper({open}:ModalProps){ 
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
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
	
}
}