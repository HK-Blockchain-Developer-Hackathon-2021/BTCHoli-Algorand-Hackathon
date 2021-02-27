import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ComplexGrid from './Card';
import Modal from '@material-ui/core/Modal';
import { Button, TextField } from '@material-ui/core';
import { CC } from '../cc/cc';
import axios from 'axios';
import building from '../images/building.jpg'

const url = 'http://127.0.0.1:5000/getForm';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

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
    width: 800,
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
  const [open2, setOpen2] = useState(false);
  const [amount, setAmount] = useState(0);
  const [multibonds, setMultiBonds] = useState([]);
  const [normalbonds, setNormalBonds] = useState([]);
  const [bondData, setBondData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(url);
      const bonds = response.data.bonds;
      const multiBonds = bonds.filter((bond) => bond.nature_of_bond === 'multi')
      const normalBonds = bonds.filter((bond) => bond.nature_of_bond !== 'multi')
      setMultiBonds(multiBonds)
      setNormalBonds(normalBonds);
      console.log(multiBonds, normalBonds)
    }
    fetchData();
  }, []);

  const openModal = () => {
    setOpen(true);
  }

  const openModal2 = () => {
    setOpen2(true);
  }

  function FormRow(props) {
    return (
      <React.Fragment >
        <h1>{props.heading}</h1>
        {props.bonds.map((bond) => {
          return (
            <Grid item xs={12}>
              <ComplexGrid openModal={props.openModal} openModal2={props.openModal2} bond={bond} setBondData={props.setBondData}/>
            </Grid>)
        })}
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container xs={6} spacing={3} >
          <FormRow heading={"Individual Tokens"} openModal={openModal} openModal2={openModal2} setBondData={setBondData} bonds={normalbonds}/>
        </Grid>
        <Grid xs={6} spacing={6}>
          <FormRow heading={"Fund Tokens"} openModal={openModal} openModal2={openModal2} bonds={multibonds} setBondData={setBondData}/>
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
          <h1>Name of Bond:  {bondData.bond_name}</h1>
          <TextField id="outlined-basic" label="USD to Invest: " variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          <h1>Enter Credit Card Details for payment through Stripe:</h1>
          <CC />
          <Button variant="contained" color="primary">
            Buy
          </Button>
          </div>
      </Modal>
      <Modal
        open={open2}
        onClose={() => {
          setOpen2(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
      <div style={{ ...modalStyle, display: 'flex', flexDirection: 'column'}} className={classes.paperTwo}>
          <div>
            {bondData.asset_id && <h4>Asset ID: {bondData.asset_id}</h4>}
            <h4>Bond Name: {bondData.bond_name}</h4>
            <h4>Coupon Rate: {bondData.coupon_rate}</h4>
            <h4>Dividend Payment Time: {bondData.unit} {bondData.frequency}</h4>
            <h4>Issue Size: {bondData.issue_size}</h4>
            <h4>Issuer Name: {bondData.issuer_name}</h4>
          </div>
          <div>
            <img src={building} style={{ height: '200px', width: '200px' }}/>
          </div>
      </div>
      </Modal>
        
    </div>
  );
}