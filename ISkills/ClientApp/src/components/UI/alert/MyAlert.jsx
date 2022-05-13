import React from 'react';
import Alert from "@mui/material/Alert";

const MyAlert = ({item, type = "error"}) => {
    return (
        <div>
            {item &&
                <Alert variant="outlined" severity={type} sx={{color: "inherit"}}>{item}</Alert>
            }
        </div>
    );
};

export default MyAlert;