import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import building from '../images/building.jpg';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function ComplexGrid(props) {
  const classes = useStyles();
  const data = props.bond
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={building} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="body2" gutterBottom>
                  <b>Name: </b> {data.bond_name}
                </Typography>
                {data.nature_of_bond !== 'multi' && <div>
                    <Typography variant="body2">
                    <b>Price: </b> {data.face_value/data.issue_size}
                    </Typography>
                    <Typography variant="body2">
                        <b>Symbol: </b> {data.bond_name.substr(0,4).toUpperCase()}
                    </Typography>
                </div>}
                {/*{data.nature_of_bond === 'multi' && <div>*/}
                {/*    <Typography variant="body2">*/}
                {/*        <b>Returns: </b> {Math.random()*100}*/}
                {/*    </Typography>*/}
                {/*</div>}*/}
              </Grid>
              <Grid item>
                <Button color="primary" variant="contained" style={{marginRight:"1vw"}} onClick={() => {
                    props.setBondData(data)
                    props.openModal();
                }}>Buy</Button>
                <Button color="primary" variant="contained" onClick={() => {
                    props.setBondData(data)
                    props.openModal2();
                }}>Learn More</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
