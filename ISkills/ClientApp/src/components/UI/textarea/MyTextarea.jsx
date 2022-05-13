import React from 'react';
import ReactHtmlParser from "react-html-parser";
import classes from './MyTextarea.module.css'

const MyTextarea = ({value, children}) => {
    return (
        <div className={classes.Textarea}>
            {children}
            {ReactHtmlParser(value)}
        </div>
    );
};

export default MyTextarea;