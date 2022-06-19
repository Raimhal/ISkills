import React from 'react';
import MyButton from "../Button/MyButton";
import classes from './ConfirmationDeleteForm.module.css'

const ConfirmationDeleteForm = ({title, remove, setDeleteModal, ...props}) => {
    return (
        <div className={classes.confirmationForm}>
            <div>Are you sure you want to delete this {title}?</div>
            <div className={classes.btns}>
                <MyButton onClick={(e) => {
                    e.stopPropagation()
                    remove(e)
                }}>I'm sure</MyButton>
                <MyButton onClick={(e) => {
                    e.stopPropagation()
                    setDeleteModal(false)
                }}>Cancel</MyButton>
            </div>
        </div>
    );
};

export default ConfirmationDeleteForm;