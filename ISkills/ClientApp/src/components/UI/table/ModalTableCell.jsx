import React, {useState} from 'react';
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MyModal from "../MyModal/MyModal";
import ConfirmationForm from "../ConfirmationForm/ConfirmationForm";
import {useDispatch} from "react-redux";

const ModalTableCell = ({title, remove, error, clearError, ...props}) => {
    const [deleteModal, setDeleteModal] = useState(false)

    return (
        <div>
            <Tooltip title="Delete" placement="bottom">
                <IconButton aria-label="delete" onClick={(e) => {
                    e.stopPropagation()
                    clearError()
                    setDeleteModal(true)
                }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            {deleteModal &&
            <MyModal visible={deleteModal} setVisible={setDeleteModal}>
                <ConfirmationForm
                    error={error}
                    title={`Are you sure you want to delete this ${title}?`}
                    action={remove}
                    setModal={setDeleteModal}
                />
            </MyModal>
            }
        </div>
    );
};

export default ModalTableCell;