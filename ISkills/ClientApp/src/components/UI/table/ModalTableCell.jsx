import React, {useState} from 'react';
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MyModal from "../MyModal/MyModal";
import ConfirmationDeleteForm from "../ConfirmationDeleteForm/ConfirmationDeleteForm";
import {useDispatch} from "react-redux";

const ModalTableCell = ({title, remove, error, clearError, ...props}) => {
    const dispatch = useDispatch()
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
                <ConfirmationDeleteForm error={error} title={title} remove={remove} setDeleteModal={setDeleteModal}/>
            </MyModal>
            }
        </div>
    );
};

export default ModalTableCell;