import React from 'react';
import {Button, Input} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles'
import {colorTheme} from "../themes";

const MyUpload = ({accept, id, required, ...props}) => {
    return (
        <ThemeProvider theme={colorTheme}>
            <label htmlFor={id}>
                <Input accept={accept} id={id} type="file" required={required} {...props} style={{display: "none"}}/>
                <Button fullWidth variant="contained" component="span">
                    Upload video
                </Button>
            </label>
        </ThemeProvider>
    );
};

export default MyUpload;