import React, {useEffect} from 'react';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function Holdings(props) {
    const classes = useStyles();

    const [data, setData] = React.useState(props.holdingData);

    useEffect(() => {
        setData(props.holdingData)
    }, [props.holdingData])


    return (
        <React.Fragment>
            <Title>Holdings</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Token</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.token}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.seeMore}>
                <Link color="primary" href="#" onClick={preventDefault}>
                    See more tokens
                </Link>
            </div>
        </React.Fragment>
    );
}
