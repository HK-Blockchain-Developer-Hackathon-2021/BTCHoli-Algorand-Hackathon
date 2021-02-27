import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "react-google-charts";
import Orders from "./Orders";
import Transactions from "./transactions";
import PNL from "./PNL";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";


const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 300,
    },
    fixedHeightPNL: {
        height: 150,
    },

}));


export default function Portfolio (props){
    const classes = useStyles();
    const fixedHeightPNL = clsx(classes.paper, classes.fixedHeightPNL);

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Chart
                        height="300px"
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Token', 'Value'],
                            ['Work', 11],
                            ['Eat', 2],
                            ['Commute', 2],
                            ['Watch TV', 2],
                            ['Sleep', 7],
                        ]}
                        options={{
                            title: '',
                            is3D: true,
                        }}
                        rootProps={{margin: 0}}
                    />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Orders/>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Transactions/>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper className={fixedHeightPNL}>
                    <PNL/>
                </Paper>
            </Grid>
        </Grid>
        );

}
