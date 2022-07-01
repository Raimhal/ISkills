import React from 'react';
import emptyListImage from "../../../assets/images/empty-list.png";

const EmptyList = ({title}) => {
    return (
        <div className="empty-list">
            <img src={emptyListImage} style={{width: "30vw"}}/>
            <h3>Nothing!!</h3>
            <p>{title}</p>
        </div>
    );
};

export default EmptyList;