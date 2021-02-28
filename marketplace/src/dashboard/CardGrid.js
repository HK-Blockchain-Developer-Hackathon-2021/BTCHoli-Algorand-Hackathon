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
import download_1 from '../images/download_1.jpeg'
import download_2 from '../images/download_2.jpeg'
import download_3 from '../images/download_3.jpeg'
import download_4 from '../images/download_4.jpeg'
import download_5 from '../images/download_5.jpeg'
import download_6 from '../images/download_6.jpeg'
import download_7 from '../images/download_7.jpeg'
import download_8 from '../images/download_8.jpeg'
import download_9 from '../images/download_9.jpeg'
import download_10 from '../images/download_10.jpeg'

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
  const [tId, setTId] = useState('');
  const [index, setIndex] = useState(0);

  function RandImg (renewable) {
    const images = [download_1, download_2, download_3, download_4, download_5, download_6, download_7, download_8, download_9, download_10]
    if (renewable) {
      return images[9 - (index%10)]
    }
    return images[index%10]
  }

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
        {props.bonds.map((bond, index) => {
          return (
            <Grid item xs={12}>
              <ComplexGrid openModal={props.openModal} openModal2={props.openModal2} bond={bond} setBondData={props.setBondData} ind={index} setIndex={props.setIndex} isRenewable={props.isRenewable}/>
            </Grid>)
        })}
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid xs={6} spacing={3} >
          <FormRow heading={"Individual Tokens"} openModal={openModal} openModal2={openModal2} setBondData={setBondData} bonds={normalbonds} setIndex={setIndex}/>
        </Grid>
        <Grid xs={6} spacing={6}>
          <FormRow heading={"Fund Tokens"} openModal={openModal} openModal2={openModal2} bonds={multibonds} setBondData={setBondData} isRenewable={true} setIndex={setIndex}/>
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
          {tId === '' && <div>
            <h1>Name of Bond:  {bondData.bond_name}</h1>
            <TextField id="outlined-basic" label="USD to Invest: " variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            <h1>Enter Credit Card Details for payment through Stripe:</h1>
            <CC />
            <Button variant="contained" color="primary" onClick={async () => {
              const url2 = 'http://127.0.0.1:5000/stripe';
              const response = await axios.post(url2, {
                amount,
                assetId: bondData.asset_id,
                userId: localStorage.getItem('mnemonic')
              })
              console.log(response)
              if(response.data.message === 'done') {
                setTId(response.data.transaction_id)
                setTimeout(() => {
                  setOpen(false);
                  setTId('')
                }, 5000)
              }
            }}>
              Buy
            </Button>
          </div>}
          {tId && <div>
            <h1>Transaction ID: {tId}</h1>
          </div>}
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
      <div style={{ ...modalStyle, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} className={classes.paperTwo}>
          <div>
            {bondData.asset_id && <h4>Asset ID: {bondData.asset_id}</h4>}
            <h4>Bond Name: {bondData.bond_name}</h4>
            {bondData.bond_name==='HKIA Runway' && <h4>Description: For the financing of the new runway at the Hong Kong International Airport. For more details <a href="https://www.icicibank.com/managed-assets/docs/personal/investments/Floating-Rate-Savings-Bonds.pdf">click here</a></h4>}
            <h4>Coupon Rate: {bondData.coupon_rate}</h4>
            <h4>Dividend Payment Time: {bondData.unit} {bondData.frequency}</h4>
            <h4>Issue Size: {bondData.issue_size}</h4>
            <h4>Issuer Name: {bondData.issuer_name}</h4>
          </div>
          <div style={{ margin: 'auto 0' }}>
            <img src={RandImg()} style={{ height: '50vh', width: '50vh' }}/>
          </div>
      </div>
      </Modal>
        
    </div>
  );
}