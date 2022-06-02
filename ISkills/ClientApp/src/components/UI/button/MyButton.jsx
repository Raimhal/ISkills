import React from 'react';
import classes from './MyButton.module.css'
import InnerLoading from "../Loading/InnerLoading";

const MyButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.myButton}>
            {children}
        </button>
    );
};

export default MyButton;