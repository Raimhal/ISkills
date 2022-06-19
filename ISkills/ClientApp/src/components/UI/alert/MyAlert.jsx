import React from 'react';
import Alert from "@mui/material/Alert";

const MyAlert = ({item, type = "error"}) => {
    return (
        item && <Alert variant="outlined" severity={type} sx={{color: "inherit"}}>{item}</Alert>
    );
};

export default MyAlert;