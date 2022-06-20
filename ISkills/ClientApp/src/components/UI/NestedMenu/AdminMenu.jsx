import React, {useState} from 'react';
import {Menu, MenuItem, Typography} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import {adminRoutes} from "../../../router";
import {Dropdown, ButtonToolbar, CustomProvider} from 'rsuite';

const AdminMenu = ({label, className, ...props}) => {
    const navigate = useNavigate()
    const onClickItem = (path) => {
        navigate(path)
    };

    return (

            <ButtonToolbar>
                <Dropdown trigger="hover" title="Admin" size="md" placement="bottomEnd" {...props}>
                    <Dropdown.Item disabled={true}>Pages</Dropdown.Item>
                     {adminRoutes.map(route =>
                         <Dropdown.Item eventKey={route.path} key={route.path} onSelect={() => onClickItem(route.path)}>{route.title}</Dropdown.Item>
                     )}
                </Dropdown>
            </ButtonToolbar>
    );
};

export default AdminMenu;