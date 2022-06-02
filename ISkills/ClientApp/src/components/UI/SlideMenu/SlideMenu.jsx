import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {useNavigate} from "react-router-dom";

export default function SlideMenu({anchor, children, buttonContent, ...props}) {
    const navigate = useNavigate()
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (position) => (
        <Box
            sx={{
                width: position === 'top' || position === 'bottom' ? 'auto' : 250,
                backgroundColor: "rgba(0,0,0,0.8)",
                height: "100%"
            }}
            role="presentation"
            onClick={toggleDrawer(position, false)}
            onKeyDown={toggleDrawer(position, false)}

        >
            <List>
                {React.Children.map(children.props.children, child => (
                    <ListItem key={child.props.to} disablePadding>
                        <ListItemButton onClick={() => {
                            navigate(child.props.to)
                            child.props.onClick()
                        }}>
                            <ListItemText primary={child.props.children} className={child.props.className} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );

    return (
                <React.Fragment key={anchor}>
                    <span onClick={toggleDrawer(anchor, true)} style={{paddingTop: "4%"}}>{buttonContent}</span>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
    );
}
