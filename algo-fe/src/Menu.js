import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Menu(props) {
  const classes = useStyles();

  const nextPath = (path) => {
    props.history.push(path);
  }

  return (
    <div>
        <Paper variant="outlined" square elevation={10} />
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh', minWidth: '100vh' }}
        >
            <Grid item xs={4}>
                <div className={classes.root}>
                    <Button variant="contained" color="primary" onClick={() => {
                        nextPath('/create')
                    }}>
                        Create Bond
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => {
                      nextPath('/approval')
                    }}>
                        Approve Bonds
                    </Button>
                    <Button variant="contained" color="primary">
                        Bond Market
                    </Button>
                </div>
            </Grid>   
        </Grid> 
    </div>
  );
}