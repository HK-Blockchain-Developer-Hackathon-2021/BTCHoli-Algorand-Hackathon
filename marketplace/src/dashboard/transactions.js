import React, {useEffect, useState} from 'react';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import axios from "axios";



function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
    buy: {
        color: "green"
    },
    sell: {
        color: "red"
    }
}));

export default function Transactions(props) {
    const classes = useStyles();

    const [transactionData, setTransactionData] = useState([]);

    useEffect(()=>{
        setTransactionData(props.transactionData)
    },[props])


    return (
        <React.Fragment>
            <Title>Transaction History</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Token</TableCell>
                        <TableCell>Side</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactionData && transactionData.map((row) => (
                        <TableRow key={row.order_no}>
                            <TableCell>{row.token}</TableCell>
                            <TableCell
                                className={row.side.startsWith("B") ? classes.buy : classes.sell}>
                                {row.side}
                            </TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell>{row.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.seeMore}>
                <Link color="primary" href="#" onClick={preventDefault}>
                    See more transactions
                </Link>
            </div>
        </React.Fragment>
    );
}
