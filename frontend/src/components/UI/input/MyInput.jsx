import React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {TextField} from "@mui/material";
import classes from './MyInput.module.css'

const MyInput = ({children, label, ...props}) => {

    const theme = createTheme({
            palette: {
                primary: {
                    main: '#975ad4',
                },
                secondary: {
                    main: '#9c27b0',
                },
            },
    });
    return (
        <ThemeProvider theme={theme}>
            <TextField
                {...props}
                label={label}
                variant="standard"
                color='primary'
                sx={{ pl: -51}}
                InputProps={{
                    classes: {
                        input: classes.myInput
                    }
                }}
            >
                {children}
            </TextField>
        </ThemeProvider>
    );
};

export default MyInput;