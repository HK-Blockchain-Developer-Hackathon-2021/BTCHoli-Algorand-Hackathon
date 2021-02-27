import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { InputLabel, FormControl, MenuItem, Select } from '@material-ui/core'   


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const Card = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="body2" gutterBottom>
                  <b>Bond Name: Static</b>
                </Typography>
                <Typography variant="body2">
                    <b>Tokens: 100 </b> 
                </Typography>
              </Grid>
              <Grid item>
                <Button color="primary" variant="contained" onClick={() => {
                    
                }}>Delete</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
    )
} 


const url = 'http://127.0.0.1:5000/getForm';
export default function P2P(props) {
  const classes = useStyles();
  const [bonds, setBonds] = React.useState([]);
  const [bondSelected, setBond] = React.useState()
  const [usdt, setUsdt] = React.useState(0)
  const [tokens, setTokens] = React.useState(0)
  const [type, setType] = React.useState(null)

  // const [isResponse, setIsResponse] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(url);
      const bonds = response.data.bonds;
      setBonds(bonds);
      console.log(bonds)
    }
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            P2P Marketplace
          </Typography>
          <React.Fragment>
                <React.Fragment>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Bond</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={bondSelected}
                                    style={{ width: 100 }}
                                    onChange={(e) => {
                                        setBond(e.target.value)
                                    }}
                                    label="Bond"
                                >
                                {bonds.map((bond) => {
                                    return (
                                        <MenuItem value={bond._id}>{bond.bond_name}</MenuItem>
                                    )
                                })}
                                </Select>
                        </FormControl>
                        </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            required
                            id="usdt"
                            name="usdt"
                            label="USDT"
                            fullWidth
                            autoComplete="usdt"
                            value={usdt}
                            onChange={(e) => setUsdt(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            required
                            id="tokens"
                            name="tokens"
                            label="Tokens"
                            fullWidth
                            autoComplete="usdt"
                            value={tokens}
                            onChange={(e) => setTokens(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={type}
                                style={{ width: 100 }}
                                onChange={(e) => {
                                setType(e.target.value)
                                }}
                                label="Type"
                            >
                                <MenuItem value={"SELL"}>Sell</MenuItem>
                                <MenuItem value={"BUY"}>Buy</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
                </React.Fragment>
                <React.Fragment>
                <div className={classes.buttons}>
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={async () => {
                        console.log({
                            userId: localStorage.getItem('mnemonic'),
                            assetId: bonds.find((bond) => bond._id === bondSelected).asset_id,
                            token_amount: tokens,
                            usdt_amount: usdt,
                            type: type
                        })
                        const url2 = 'http://localhost:5000/createOrder'
                        const response = await axios.post(url2, {
                            userId: localStorage.getItem('mnemonic'),
                            assetId: bonds.find((bond) => bond._id === bondSelected).asset_id,
                            tokenAmount: tokens,
                            usdtAmount: usdt,
                            type: type
                        })
                        if(response.data.message === 'done') {
                            alert('submitted order')
                            setBond()
                            setUsdt(0)
                            setTokens(0)
                            setType(null)
                        }
                    }}
                    >
                    Send Order    
                    </Button>
                </div>
                </React.Fragment>
            </React.Fragment>
        </Paper>
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                My Orders
            </Typography>
            {[0,1].map(() => {
                return (
                    <Card />
                )
            })}
        </Paper>
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Others Orders
            </Typography>
            {[0,1].map(() => {
                return (
                    <Card type="other"/>
                )
            })}
        </Paper>
      </main>
    </React.Fragment>
  );
}