import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import building from '../images/building.jpg';
import { Button } from '@material-ui/core';
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
  const index = props.ind
  const isRenewable = props.isRenewable ? true : false;


  function RandImg (renewable) {
    const images = [download_1, download_2, download_3, download_4, download_5, download_6, download_7, download_8, download_9, download_10]
    if (renewable) {
      return images[9 - (index%10)]
    }
    return images[index%10]
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={RandImg(isRenewable)} />
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
                    props.setIndex(index);
                }}>Buy</Button>
                <Button color="primary" variant="contained" onClick={() => {
                    props.setBondData(data)
                    props.openModal2();
                    props.setIndex(index);
                }}>Learn More</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
