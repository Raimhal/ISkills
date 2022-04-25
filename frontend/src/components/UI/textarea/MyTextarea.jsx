import React from 'react';
import ReactHtmlParser from "react-html-parser";
import classes from './MyTextarea.module.css'

const MyTextarea = ({value}) => {
    return (
        <div className={classes.Textarea}>
            {ReactHtmlParser(value)}
        </div>
    );
};

export default MyTextarea;