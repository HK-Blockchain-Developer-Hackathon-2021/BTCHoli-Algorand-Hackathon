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
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {MainListItems} from './listItems';
import ViewEnum from "./ViewEnum";
import NestedGrid from './CardGrid';
import Portfolio from "./Portfolio";
import { css } from '@emotion/core';
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

import DetailsForm from './ReferralForm';
import P2P from './P2P';


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

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
        paddingRight: 24,
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
        height:"100vh",
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

export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [view, setView] = React.useState(ViewEnum.DASHBOARD);
    const [data, setData] = React.useState({transactionData: [], holdingData: [], chartData: [], dividendData:0});
    const [isLoading, setIsLoading] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getData();
        const timer = setInterval(() => getData(), 1000);
        return () => clearInterval(timer);
    }, [])


    const getData = () => {
        axios.post("http://localhost:5000/getProfile", {
            userId: "valve affair shoulder all exhaust evil small model tornado inspire crane army horse dismiss ridge book quiz tribe sport hero wild slab grape absent rebuild"
        })
            .then(res => {
                const result = res.data;
                const netWorth = data.chartData;

                if (netWorth.length >= 100) {
                    netWorth.shift();
                }
                netWorth.push(result.netPortfolio);

                const d = {
                    holdingData: result.holdings,
                    transactionData: result.transactions,
                    chartData: netWorth,
                    dividendData:result.dividends
                }
                setData(d);
                setIsLoading(false);
            })
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
                    {/*<Button variant="contained" color="default">View Wallet</Button>*/}
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
                    {isLoading ?
                        <div style={{ marginTop: "30vh", textAlign: "center" }}><HashLoader
                            css={override}
                            sizeUnit={"px"}
                            size={150} color={'#123abc'}
                        /><br /><h2>LOADING...</h2></div>
                        :
                        <Switch test={view}>
                            <div value={ViewEnum.DASHBOARD}>
                                <Portfolio data={data}/>
                            </div>

                            <div value={ViewEnum.ORDERNOW} style={{ display: 'flex', flexDirection: 'row'}}>
                                <NestedGrid />
                            </div>
                            <div value={ViewEnum.REFERRAL} style={{ display: 'flex', flexDirection: 'row'}}>
                                <DetailsForm />
                            </div>
                            <div value={ViewEnum.P2P} style={{ display: 'flex', flexDirection: 'row'}}>
                                <P2P />
                            </div>
                        </Switch>
                    }
                    <Box pt={4}>
                        <Copyright/>
                    </Box>
                </Container>
            </main>

        </div>
    );
}
