import React from 'react';
import MyButton from "../Button/MyButton";
import classes from './ConfirmationForm.module.css'
import MyAlert from "../Alert/MyAlert";

const ConfirmationForm = ({title, action, setModal, error, ...props}) => {
    return (
        <div className={classes.confirmationForm}>
            <div>{title}</div>
            <MyAlert item={error}/>
            <div className={classes.btns}>
                <MyButton onClick={(e) => {
                    e.stopPropagation()
                    action(e)
                }}>I'm sure</MyButton>
                <MyButton onClick={(e) => {
                    e.stopPropagation()
                    setModal(false)
                }}>Cancel</MyButton>
            </div>
        </div>
    );
};

export default ConfirmationForm;