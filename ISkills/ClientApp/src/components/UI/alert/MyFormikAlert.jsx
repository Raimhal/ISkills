import React from 'react';

const MyFormikAlert = ({condition, item, color = "#d32f2f"}) => {
    return (
        <div>
            {condition &&
            <p style={{fontSize: "12px", color: color}}>{item}</p>
            }
        </div>
    );
};

export default MyFormikAlert;