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
                sx={{ mb: "1.2rem"}}
                className={classes.myInput}
                InputLabelProps={{style: {fontFamily: "Times New Roman"}}}
            >
                {children}
            </TextField>
        </ThemeProvider>
    );
};

export default MyInput;