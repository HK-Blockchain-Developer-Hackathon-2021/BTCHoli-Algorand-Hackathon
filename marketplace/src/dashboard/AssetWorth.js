import React, {useEffect} from 'react';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
    red: {
        color: "red"
    },
    green: {
        color: "green"
    }
});

export default function AssetWorth(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [direction, setDirection] = React.useState(true);


    useEffect(() => {
        const worth = Math.round(props.assetWorth * 100) / 100;
        if (value) {
            if (value !== worth) {
                value > worth ? setDirection(false) : setDirection(true);
            }
        }
        setValue(worth);
    }, [props])

    return (
        <React.Fragment>
            <Title>Total Asset Worth</Title>
            <Typography component="p" variant="h4">
                {value} <span className={direction ? classes.green : classes.red}>
                {direction ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>}
            </span>
            </Typography>
            <div>
            </div>
        </React.Fragment>
    );
}
