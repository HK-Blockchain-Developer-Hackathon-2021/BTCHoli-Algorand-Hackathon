import React, {useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {MainListItems} from './listItems';
import ViewEnum from "./ViewEnum";
import Portfolio from "./Portfolio";

import axios from "axios";


const Switch = props => {
    const {test, children} = props
    return children.find(child => {
        return child.props.value === test
    })
}

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit">
                BTCHoli
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
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
    fixedHeight: {
        height: 240,
    },
    fixedHeightPNL: {
        height: 150,
    },

}));


function createData(id, token, quantity, value) {
    return {id, token, quantity, value};
}

const rows = [
    createData(0, 'ABC', 10, 312.44),
    createData(1, 'DEF', 12, 866.99),
    createData(2, 'GHI', 23, 100.81),
    createData(3, 'SFD', 23, 654.39),
    createData(4, 'WFE', 43, 212.79),
];


function createChartRows(time, amount) {
    return {time, amount};
}

const chartRows = [
    createChartRows('00:00', 0),
    createChartRows('03:00', 300),
    createChartRows('06:00', 600),
    createChartRows('09:00', 800),
    createChartRows('12:00', 1500),
    createChartRows('15:00', 2000),
    createChartRows('18:00', 2400),
    createChartRows('21:00', 2400),
    createChartRows('24:00', undefined),
];

function createTransactionData(order_no, token, side, price, quantity, time) {
    let total = price * quantity;
    return {order_no, token, side, price, quantity, total, time};
}

const transactionRows = [
    createTransactionData(0, 'ABC', "BUY", 312.44, 10, "10:12:32"),
    createTransactionData(1, 'DEF', "SELL", 866.99, 32, "10:12:32"),
    createTransactionData(2, 'GHI', "SELL", 100.81, 413, "10:12:32"),
    createTransactionData(3, 'SFD', "BUY", 654.39, 14, "10:12:32"),
    createTransactionData(4, 'WFE', "SELL", 212.79, 4123, "10:12:32")
];

export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [view, setView] = React.useState(ViewEnum.DASHBOARD);
    const [data, setData] = React.useState({});

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        // const timer = setInterval(() => getData(), 1000);
        // return () => clearInterval(timer);
    }, [])


    const getData = () => {
        // console.log("getting data");
        // axios.get("")
        //     .then(res => {
        //         const d = res.data;
        //         setData(d);
        //     })
    }
    const handleViewClick = (view) => {
        setView(view);
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Dashboard
                    </Typography>
                    <Button variant="contained" color="default">View Wallet</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <MainListItems onClick={handleViewClick}/>
            </Drawer>

            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
                    <Switch test={view}>
                        <div value={ViewEnum.DASHBOARD}>
                            <Portfolio data={data}/>
                        </div>

                        <div value={ViewEnum.ORDERNOW}>
                            WHATTTTTTT
                        </div>
                    </Switch>

                    <Box pt={4}>
                        <Copyright/>
                    </Box>
                </Container>
            </main>

        </div>
    );
}
