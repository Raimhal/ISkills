import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {useNavigate} from "react-router-dom";
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

export default function SlideMenu({anchor, children, buttonContent, adminChildren = null, ...props}) {
    const navigate = useNavigate()
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [open, setOpen] = useState(false)

    const handleClick = (e) => {
        e.stopPropagation()
        setOpen(!open)
    }

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
                height: "100%",
                // minHeight: "100vh",
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
                            child.props.onClick && child.props.onClick()
                        }}>
                            <ListItemText primary={child.props.children} className={child.props.className} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            {adminChildren && <List>
                <ListItemButton onClick={handleClick} className={adminChildren.props.children[0]?.props.className}>
                    <ListItemText primary="Admin"/>
                    {open ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {React.Children.map(adminChildren?.props.children, child => (
                            <ListItem key={child.props.to} disablePadding>
                                <ListItemButton sx={{pl: 4}} onClick={() => {
                                    navigate(child.props.to)
                                    child.props.onClick && child.props.onClick()
                                }}
                                >
                                    <ListItemText primary={child.props.children} className={child.props.className}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </List>
            }
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
