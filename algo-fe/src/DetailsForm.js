import React from 'react';
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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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



export default function DetailsForm(props) {
  const classes = useStyles();
  const [bondName, setBondName] = React.useState('')
  const [issuerName, setIssuerName] = React.useState('')
  const [couponRate, setCouponRate] = React.useState(0);
  const [faceValue, setFaceValue] = React.useState(0);
  const [issueDate, setIssueDate] = React.useState(new Date());
  const [maturityDate, setMaturityDate] = React.useState(new Date());
  const [numberOfAnnualPayments, setNumberOfAnnualPayments] = React.useState(1);
  const [nature, setNature] = React.useState('');
  const [issueSize, setIssueSize] = React.useState(1);
  const [frequency, setFrequency] = React.useState('seconds');
  const [isResponse, setIsResponse] = React.useState(false);

  const url = 'http://127.0.0.1:5000/bondForm';

  const nextPath = (path) => {
    props.history.push(path);
  }
  

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          {!isResponse && <Typography component="h1" variant="h4" align="center">
            Bond Details
          </Typography>}
          {!isResponse && <React.Fragment>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="bondName"
                    name="bondName"
                    label="Bond name"
                    fullWidth
                    autoComplete="bond-name"
                    value={bondName}
                    onChange={(e) => setBondName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="issuerName"
                    name="issuerName"
                    label="Issuer Name"
                    fullWidth
                    autoComplete="issuerName"
                    value={issuerName}
                    onChange={(e) => setIssuerName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="couponRate"
                    name="couponRate"
                    label="Coupon Rate"
                    type="number"
                    fullWidth
                    autoComplete="couponRate"
                    value={couponRate}
                    onChange={(e) => setCouponRate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="issueSize"
                    name="issueSize"
                    label="Issue Size"
                    type="number"
                    fullWidth
                    autoComplete="issueSize"
                    value={issueSize}
                    onChange={(e) => setIssueSize(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="faceValue"
                    name="faceValue"
                    label="Face Value"
                    fullWidth
                    type="number"
                    autoComplete="faceValue"
                    value={faceValue}
                    onChange={(e) => setFaceValue(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="issueDate"
                    name="issueDate"
                    label="Issue Date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    type="date"
                    autoComplete="issueDate"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                  required
                  id="maturityDate"
                  name="maturityDate"
                  label="Maturity Date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  type="date"
                  autoComplete="maturityDate"
                  value={maturityDate}
                  onChange={(e) => setMaturityDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="unit"
                    name="unit"
                    label="Unit"
                    fullWidth
                    type="number"
                    autoComplete="numberOfAnnualPayments"
                    value={numberOfAnnualPayments}
                    onChange={(e) => setNumberOfAnnualPayments(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Frequency</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={frequency}
                        onChange={(e) => {
                          setFrequency(e.target.value)
                        }}
                        label="Frequency"
                      >
                        <MenuItem value={"seconds"}>Seconds</MenuItem>
                        <MenuItem value={"minutes"}>Minutes</MenuItem>
                        <MenuItem value={"hourly"}>Hourly</MenuItem>
                        <MenuItem value={"daily"}>Daily</MenuItem>
                        <MenuItem value={"monthly"}>Monthly</MenuItem>
                        <MenuItem value={"annually"}>Annually</MenuItem>
                      </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="nature"
                    name="nature"
                    label="Nature of Bond"
                    fullWidth
                    autoComplete="nature"
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                  />
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
                    // console.log(bondName, issuerName, couponRate, faceValue, issueDate,nature, maturityDate, numberOfAnnualPayments, )
                    const response = await axios.post(url, 
                      { 
                        bondName,
                        issuerName,
                        couponRate,
                        faceValue,
                        issueDate,
                        natureOfBond: nature,
                        maturityDate,
                        issueSize,
                        numberOfAnnualPayments,
                        frequency
                      })
                    if (response.data.message === 'done') {
                      console.log(response)
                      setIsResponse(true);
                    }
                    console.log(response)
                  }}
                >
                  Create Bond
                </Button>
              </div>
            </React.Fragment>
            </React.Fragment>}
            {isResponse && <React.Fragment>
              <Typography component="h1" variant="h4" align="center">
                  Bond Submitted
              </Typography>
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => {
                    nextPath('/menu')
                  }}
                >
                  Back To Menu
                </Button>
              </div>
            </React.Fragment>}
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
}