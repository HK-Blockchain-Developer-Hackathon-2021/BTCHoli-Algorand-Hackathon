import React, {useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

export default function Dividend(props) {
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        const worth = Math.round(props.dividend * 10000) / 10000;
        setValue(worth);
    }, [props])

    return (
        <React.Fragment>
            <Title>Net Dividend Increase</Title>
            <Typography component="p" variant="h4">
                {value}
            </Typography>
            <div>
            </div>
        </React.Fragment>
    )
}

