import React from 'react';
import {Button, Input} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles'
import Loading from "../Loading/Loading";
import {colorTheme} from "../../../styleThemes";

const MyUpload = ({accept, id, required, isLoading, title, ...props}) => {
    return (
        <ThemeProvider theme={colorTheme}>
            <label htmlFor={id}>
                <Input accept={accept} id={id} type="file" required={required} {...props} style={{display: "none"}}/>
                <Button fullWidth variant="contained" component="span">
                    {!isLoading ? title : <Loading/>}
                </Button>
            </label>
        </ThemeProvider>
    );
};

export default MyUpload;