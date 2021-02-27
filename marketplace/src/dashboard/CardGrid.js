import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ComplexGrid from './Card';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';

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

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paperTwo: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function NestedGrid() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  }

  function FormRow(props) {
    return (
      <React.Fragment >
        <h1>{props.heading}</h1>
        <Grid item xs={12}>
          <ComplexGrid openModal={props.openModal}/>
        </Grid>
        <Grid item xs={12}>
          <ComplexGrid openModal={props.openModal} />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={6} spacing={3} >
          <FormRow heading={"Individual Tokens"} openModal={openModal}/>
        </Grid>
        <Grid container item xs={6} spacing={3}>
          <FormRow heading={"Fund Tokens"} openModal={openModal}/>
        </Grid>
      </Grid>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paperTwo}>
            <h1>Name of Bond</h1>
            <Button variant="contained" color="primary">
              Buy
            </Button>
           </div>
        </Modal>
    </div>
  );
}