import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import {InputLabel, FormControl, MenuItem, Select} from '@material-ui/core'
import BeatLoader from "react-spinners/BeatLoader";
import Alert from '@material-ui/lab/Alert';

const Actions = {
    NOACTION: 0,
    REQUESTED: 1,
    SUCCESS: 2
}

let countId = 0;

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: "70vw",
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

    const [data, setData] = React.useState();


    useEffect(() => {
        setData(props.data);
    }, [props])

    return (data === undefined ? <></> :

            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="body2" gutterBottom>
                                        <b>Bond Name: {data.asset_id}</b>
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>Quantity: {data.token_amount} </b>
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>USDT Amount: {data.usdt_amount} </b>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {props.type === "my" ? <Button color="primary" variant="contained" onClick={() => {
                                            props.onRemove(data._id);
                                            props.onAction(Actions.SUCCESS);
                                        }}>Delete</Button> :
                                        <Button color="primary" variant="contained" onClick={async () => {
                                            props.onAction(Actions.REQUESTED)
                                            const response = await axios.get("http://127.0.0.1:5000/orders/fill",
                                                {
                                                    params: {
                                                        userId: localStorage.getItem("mnemonic"), orderId:
                                                        data._id
                                                    }
                                                }
                                            );
                                            if (response.status === 200) {
                                                props.onRemove(data._id);
                                                props.onAction(Actions.SUCCESS);
                                            }

                                        }}>Execute</Button>

                                    }

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
    const [type, setType] = React.useState(null);
    const [myOrders, setMyOrders] = React.useState([]);
    const [otherOrders, setOtherOrders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [makeOrderAction, setMakeOrderAction] = React.useState(Actions.NOACTION);
    const [myOrderAction, setMyOrderAction] = React.useState(Actions.NOACTION);
    const [otherOrderAction, setOtherOrderAction] = React.useState(Actions.NOACTION);


    const handleMyOrderRemove = (id) => {
        const o = myOrders.filter(elem => elem._id !== id);
        setMyOrders(o);
    }
    const handleOtherOrderRemove = (id) => {
        const o = otherOrders.filter(elem => elem._id !== id);
        setOtherOrders(o);
    }


    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(url);
            const bonds = response.data.bonds;
            setBonds(bonds);
        }

        async function fetchOrderData() {
            const response = await axios.get("http://127.0.0.1:5000/orders",
                {params: {userId: localStorage.getItem("mnemonic")}}
            );
            const my_orders = response.data.my_orders;
            const other_orders = response.data.market_orders;


            setMyOrders(my_orders);
            setOtherOrders(other_orders);
            setIsLoading(false);
        }

        fetchData();
        fetchOrderData();
    }, []);

    const addToMyOrders = (order) => {
        let mo = myOrders;
        mo.push(order);
        setMyOrders(mo);
    }

    let makeOrderMessage = <></>
    if (makeOrderAction === Actions.REQUESTED) {
        makeOrderMessage = <Alert severity="info" style={{margin: "0.5vh"}} onClose={() => {
            setMakeOrderAction(Actions.NOACTION)
        }}>Order Requested</Alert>
    } else if (makeOrderAction === Actions.SUCCESS) {
        makeOrderMessage = <Alert severity="success" style={{margin: "0.5vh"}} onClose={() => {
            setMakeOrderAction(Actions.NOACTION)
        }}>Order Successful</Alert>
    }


    let myOrderMessage = <></>
    if (myOrderAction === Actions.REQUESTED) {
        myOrderMessage = <Alert severity="info" style={{margin: "0.5vh"}} onClose={() => {
            setMyOrderAction(Actions.NOACTION)
        }}>Order Requested</Alert>
    } else if (myOrderAction === Actions.SUCCESS) {
        myOrderMessage = <Alert severity="success" style={{margin: "0.5vh"}} onClose={() => {
            setMyOrderAction(Actions.NOACTION)
        }}>Order Successful</Alert>
    }


    let otherOrderMessage = <></>
    if (otherOrderAction === Actions.REQUESTED) {
        otherOrderMessage = <Alert severity="info" style={{margin: "0.5vh"}} onClose={() => {
            setOtherOrderAction(Actions.NOACTION)
        }}>Order Requested</Alert>
    } else if (otherOrderAction === Actions.SUCCESS) {
        otherOrderMessage = <Alert severity="success" style={{margin: "0.5vh"}} onClose={() => {
            setOtherOrderAction(Actions.NOACTION)
        }}>Order Successful</Alert>
    }


    return (
        <React.Fragment>
            <CssBaseline/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        P2P Marketplace
                    </Typography>
                    {makeOrderMessage}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Bond</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={bondSelected === undefined ? "" : bondSelected}
                                    style={{width: 100}}
                                    onChange={(e) => {
                                        setBond(e.target.value)
                                    }}
                                    label="Bond"
                                >
                                    {bonds.map((bond) => {
                                        return (
                                            <MenuItem key={bond._id}
                                                      value={bond._id}>{bond.bond_name}</MenuItem>
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
                                    style={{width: 100}}
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

                    <div className={classes.buttons}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={async () => {
                                setMakeOrderAction(Actions.REQUESTED)
                                const url2 = 'http://localhost:5000/createOrder'

                                const order = {
                                    userId: localStorage.getItem('mnemonic'),
                                    assetId: bonds.find((bond) => bond._id === bondSelected).asset_id,
                                    tokenAmount: tokens,
                                    usdtAmount: usdt,
                                    type: type
                                }

                                const response = await axios.post(url2, order);

                                if (response.data.message === 'done') {
                                    setMakeOrderAction(Actions.SUCCESS)
                                    addToMyOrders({
                                        _id: countId++,
                                        user_id: order.userId,
                                        asset_id: bonds.find((bond) => bond._id === bondSelected).bond_name,
                                        token_amount: order.tokenAmount,
                                        usdt_amount: order.usdtAmount,
                                        type: order.type
                                    })
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

                </Paper>

                <Typography component="h1" variant="h4" align="center">
                    <BeatLoader margin={"auto"} type="ThreeDots" height={80} width={80} color={'#123abc'}
                                loading={isLoading}/>
                </Typography>

                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        My Orders
                    </Typography>
                    {myOrderMessage}
                    {myOrders && myOrders.map((order) => {
                        return (
                            <Card type="my" data={order} key={order._id} onRemove={handleMyOrderRemove}
                                  onAction={setMyOrderAction}/>
                        )
                    })}
                </Paper>
                <Paper className={classes.paper}>

                    <Typography component="h1" variant="h4" align="center">
                        Market
                    </Typography>
                    {otherOrderMessage}
                    {otherOrders && otherOrders.map((order) => {
                        return (
                            <Card type="other" data={order} key={order._id}
                                  onRemove={handleOtherOrderRemove} onAction={setOtherOrderAction}/>
                        )
                    })}
                </Paper>
            </main>
        </React.Fragment>
    );
}