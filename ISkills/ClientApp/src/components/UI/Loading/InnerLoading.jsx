import React from 'react';
import classes from './Loading.module.css'
import {CircularProgress, ThemeProvider} from "@mui/material";
import {colorTheme} from "../../../styleThemes";

const InnerLoading = () => {
    return (
        <ThemeProvider theme={colorTheme}>
            <CircularProgress color="primary" size={25} sx={{p: 0, m: 0}} className={classes.Inner__Loading}/>
        </ThemeProvider>
    );
};

export default InnerLoading;