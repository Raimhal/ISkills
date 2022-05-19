import React from 'react';
import classes from './Loading.module.css'
import {colorTheme} from "../Themes";
import {CircularProgress, ThemeProvider} from "@mui/material";

const Loading = () => {
    return (
        <ThemeProvider theme={colorTheme}>
            <CircularProgress color="primary" size={25} sx={{p: 0, m: 0}}/>
        </ThemeProvider>
    );
};

export default Loading;