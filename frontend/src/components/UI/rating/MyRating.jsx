import React, {useState} from 'react';
import {Rating} from "react-simple-star-rating";
import classes from './MyRating.module.css'

const MyRating = ({readonly = false, value, onChange, ...props}) => {
    const [rating, setRating] = useState(value * 20)

    const handleRating = (rate) => {
        setRating(rate)
        onChange(rate / 20)
    }

    return (
        <div className={classes.rating}>
            <p>{(rating / 20).toFixed(2)}</p>
            <Rating onClick={handleRating} ratingValue={rating} readonly={readonly} size={20}/>
        </div>
    );
};

export default MyRating;