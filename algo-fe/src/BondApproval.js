import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import axios from 'axios';

const url = 'http://127.0.0.1:5000/getForm';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function createData(_id, bond_name, coupon_rate, issuer_name, face_value, issue_date, maturity_date, number_of_annual_payments, nature_of_bond, issue_size, is_signed) {
  return {
    _id,
    bond_name,
    coupon_rate,
    issuer_name,
    face_value,
    issue_date,
    maturity_date,
    number_of_annual_payments,
    nature_of_bond,
    issue_size,
    is_signed,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.bond_name}
        </TableCell>
        <TableCell align="right">{row.coupon_rate}</TableCell>
        <TableCell align="right">{row.face_value}</TableCell>
        <TableCell align="right">{row.issue_date}</TableCell>
        <TableCell align="right">{row.maturity_date}</TableCell>
        <TableCell align="right">
            <Button
            variant="contained"
            color="primary"
            disabled={row.is_signed}
            className={classes.button}
            onClick={() => {
                console.log(row._id)
            }}
            >
                Approve
            </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                More Info
              </Typography>
              <p><b>Issuer Name: </b> {row.issuer_name}</p>
              <p><b>Number of Annual Payments: </b> {row.number_of_annual_payments}</p>
              <p><b>Nature of Bond: </b> {row.nature_of_bond}</p>
              <p><b>Issue Size: </b> {row.issue_size}</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function BondApproval(props) {
  const classes = useRowStyles();
  const [rows, setRows] = useState([]);
  const nextPath = (path) => {
    props.history.push(path);
  }

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(url);
      setRows(response.data.bonds)
    }
    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', alignContents: 'center' }}>
      <Table aria-label="collapsible table" style={{ width: 1300, margin: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Bond Name</TableCell>
            <TableCell align="right">Coupon Rate</TableCell>
            <TableCell align="right">Face Value</TableCell>
            <TableCell align="right">Issue Date</TableCell>
            <TableCell align="right">Maturity Date</TableCell>
            <TableCell align="right">Approve</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
      <br />
      <br />
      <br />
      <div align='center'>
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
            nextPath('/menu')
            }}
        >
            Back To Menu
        </Button>
      </div>
    </div>
  );
}