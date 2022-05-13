import React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {TextField} from "@mui/material";
import classes from './MyInput.module.css'
import {colorTheme} from "../themes";

const MyInput = ({children, label, ...props}) => {
    return (
        <ThemeProvider theme={colorTheme}>
            <TextField
                {...props}
                label={label}
                variant="standard"
                color='primary'
                className={classes.myInput}
                InputLabelProps={{style: {fontFamily: "inherit", color: "inherit", fontSize: "inherit"}}}
                InputProps={{style: {fontSize: "inherit"}}}
                autoComplete="off"
            >
                {children}
            </TextField>
        </ThemeProvider>
    );
};

export default MyInput;