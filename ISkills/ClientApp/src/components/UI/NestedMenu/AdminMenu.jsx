import React, {useState} from 'react';
import {Menu, MenuItem, Typography} from "@material-ui/core";
import {useLocation, useNavigate} from "react-router-dom";
import {adminRoutes} from "../../../router";
import {Dropdown, ButtonToolbar, CustomProvider} from 'rsuite';

const AdminMenu = ({label, className, ...props}) => {
    const navigate = useNavigate()
    const onClickItem = (path) => {
        navigate(path)
    };
    const location = useLocation()


    return (
            <ButtonToolbar>
                <Dropdown trigger="click" title="Admin" size="md" placement="bottomEnd" {...props}>
                    <Dropdown.Item disabled={true}>Pages</Dropdown.Item>
                     {adminRoutes.map(route =>
                         <Dropdown.Item eventKey={route.path} key={route.path} onSelect={(e) => {
                             onClickItem(route.path)

                         }} active={route.path === location.pathname}>{route.title}</Dropdown.Item>
                     )}
                </Dropdown>
            </ButtonToolbar>
    );
};

export default AdminMenu;