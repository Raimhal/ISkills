import React, {useEffect, useState} from 'react';
import {Menu, MenuItem, Typography} from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useFetching} from "../../../hooks/useFetching";
import ThemeService from "../../../API/ThemeService";
import {setCategories} from "../../../store/CategoryReducer";
import CategoryService from "../../../API/CategoryService";
import {setParams} from "../../../store/CourseReducer";
import {adminRoutes} from "../../../router";
import classes from "../navbar/Navbar.module.css";

const AdminMenu = ({label, className, props}) => {
    const [menuPosition, setMenuPosition] = useState(null);
    const navigate = useNavigate()
    const onClickItem = (path) => {
        setMenuPosition(null);
        navigate(path)
    };



    const handleMouseEnter = (event) => {
        if (menuPosition) {
            return;
        }
        event.preventDefault();
        setMenuPosition({
            top: event.pageY,
            left: event.pageX
        });
    }

    return (
        <div onClick={handleMouseEnter} {...props} className={className}>
            <Typography className={`paraSelect`}>
                {label}
            </Typography>
            <Menu
                open={!!menuPosition}
                onClose={() => setMenuPosition(null)}
                anchorReference="anchorPosition"
                anchorPosition={menuPosition}
            >
                <MenuItem disabled>Pages</MenuItem>
                {adminRoutes.map(route =>
                    <MenuItem key={route.path} onClick={() => onClickItem(route.path)}>{route.title}</MenuItem>
                )}
            </Menu>
        </div>
    );
};

export default AdminMenu;