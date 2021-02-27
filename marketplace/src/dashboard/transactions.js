import React from 'react';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data
function createData(order_no, token, side, price, quantity, time) {
    let total = price * quantity;
    return {order_no, token, side, price, quantity, total, time};
}

const rows = [
    createData(0, 'ABC', "BUY", 312.44, 10, "10:12:32"),
    createData(1, 'DEF', "SELL", 866.99, 32, "10:12:32"),
    createData(2, 'GHI', "SELL", 100.81, 413, "10:12:32"),
    createData(3, 'SFD', "BUY", 654.39, 14, "10:12:32"),
    createData(4, 'WFE', "SELL", 212.79, 4123, "10:12:32")
];

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

export default function Transactions() {
    const classes = useStyles();
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
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.order_no}>
                            <TableCell>{row.token}</TableCell>
                            <TableCell
                                className={row.side.startsWith("B") ? classes.buy : classes.sell}>
                                {row.side}
                            </TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
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
