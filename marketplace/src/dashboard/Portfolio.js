import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "react-google-charts";
import Holdings from "./Holdings";
import Transactions from "./transactions";
import PNL from "./PNL";
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {Chart as LineChart}from "./Chart";


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
    fixedHeightChart:{
        height: 300
    }

}));


const getPieChartData = (data) => {
    let pieChartData = [];

    if (data !== undefined && data.holdingData !== undefined && data.holdingData.length !== 0) {
        let keys = ["token", "value"];
        pieChartData.push(keys);
        data.holdingData.forEach(element => {
            let entry = [];
            keys.forEach(key => {
                entry.push(element[key]);
            })
            pieChartData.push(entry);
        })
    }

    return pieChartData;
}


export default function Portfolio(props) {
    const classes = useStyles();
    const fixedHeightPNL = clsx(classes.paper, classes.fixedHeightPNL);
    const fixedHeightChart = clsx(classes.paper, classes.fixedHeightChart);

    const [pieChartData, setPieChartData] = React.useState([]);
    const [holdingData, setHoldingData] = React.useState([]);
    const [transactionData, setTransactionData] = React.useState([]);
    const [chartData, setChartData] = React.useState([]);

    useEffect(() => {
        setPieChartData(getPieChartData(props.data));
        setHoldingData(props.data.holdingData);
        setTransactionData(props.data.transactionData);
        console.log(props.data.chartData);
        setChartData(props.data.chartData);
    }, [props.data])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={fixedHeightChart}>
                    <LineChart chartData={chartData}/>
                </Paper>

            </Grid>

            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Chart
                        height="250px"
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={pieChartData}
                        options={{
                            is3D: true,
                        }}
                    />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Holdings holdingData={holdingData}/>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Transactions transactionData={transactionData}/>
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
