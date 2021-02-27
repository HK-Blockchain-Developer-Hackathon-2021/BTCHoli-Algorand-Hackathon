import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import List from '@material-ui/core/List';
import ViewEnum from "./ViewEnum";

export function MainListItems(props) {

    let handleClick = (view) => {
        console.log(view);
        props.onClick(view);
    }

    return (
        <List>
            <div>
                <ListItem button onClick={() => handleClick(ViewEnum.DASHBOARD)}>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard"/>
                </ListItem>
                <ListItem button onClick={() => handleClick(ViewEnum.ORDERNOW)}>
                    <ListItemIcon>
                        <ShoppingCartIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Trade Now"/>
                </ListItem>
                <ListItem button onClick={() => handleClick(ViewEnum.REFERRAL)}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Refer a friend"/>
                </ListItem>
                <ListItem button onClick={() => handleClick(ViewEnum.P2P)}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="P2P Marketplace"/>
            </ListItem>
                {/*<ListItem button>*/}
                {/*    <ListItemIcon>*/}
                {/*        <PeopleIcon/>*/}
                {/*    </ListItemIcon>*/}
                {/*    <ListItemText primary="Customers"/>*/}
                {/*</ListItem>*/}
                {/*<ListItem button>*/}
                {/*    <ListItemIcon>*/}
                {/*        <BarChartIcon/>*/}
                {/*    </ListItemIcon>*/}
                {/*    <ListItemText primary="Reports"/>*/}
                {/*</ListItem>*/}
                {/*<ListItem button>*/}
                {/*    <ListItemIcon>*/}
                {/*        <LayersIcon/>*/}
                {/*    </ListItemIcon>*/}
                {/*    <ListItemText primary="Integrations"/>*/}
                {/*</ListItem>*/}
            </div>
        </List>
    );
}