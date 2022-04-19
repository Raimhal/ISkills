import React, {useState} from 'react';
import {Rating} from "react-simple-star-rating";
import classes from './MyRating.module.css'

const MyRating = ({readonly = false, value, onChange, ...props}) => {
    return (
        <div className={classes.rating}>
            <p>{((+value).toFixed(2))}</p>
            <Rating {...props} onClick={(rate) => onChange(rate / 20)} ratingValue={value * 20} readonly={readonly} size={20}/>
        </div>
    );
};

export default MyRating;