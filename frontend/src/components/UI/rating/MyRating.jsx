import React, {useState} from 'react';
import {Rating} from "react-simple-star-rating";

const MyRating = ({readonly, value, onChange, ...props}) => {
    const [rating, setRating] = useState(value * 20)

    const handleRating = (rate) => {
        setRating(rate)
        onChange(rate / 20)
    }

    return (
        <Rating onClick={handleRating} ratingValue={rating} readonly={readonly} size={20}/>
    );
};

export default MyRating;