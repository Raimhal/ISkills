import React from 'react';
import classes from './MyModal.module.css'

const MyModal = ({children, visible, setVisible, childrenStyle = {},...props}) => {

    const rootClasses = [classes.myModal]
    if(visible)
        rootClasses.push(classes.active)

    return (
        <div {...props} className={rootClasses.join(' ')} onMouseDown={() => setVisible(false)}>
            <div style={childrenStyle} className={classes.myModalContent} onMouseDown={(e) => e.stopPropagation()}>
                    {children}
            </div>
        </div>
    );
};

export default MyModal;