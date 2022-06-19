import React, {useState} from 'react';
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MyModal from "../UI/MyModal/MyModal";
import ConfirmationDeleteForm from "../UI/ConfirmationDeleteForm/ConfirmationDeleteForm";

const VideoDeleteItem = ({remove}) => {
    const [deleteModal, setDeleteModal] = useState(false)
    return (
        <div>
            <IconButton aria-label="delete" onClick={(e) => {
                e.stopPropagation()
                setDeleteModal(true)
            }
            }>
                <DeleteIcon/>
            </IconButton>
            {deleteModal &&
                <MyModal visible={deleteModal} setVisible={setDeleteModal} onClick={(e) => {e.stopPropagation()}}>
                    <ConfirmationDeleteForm title="video" remove={(e) => remove(e)} setDeleteModal={setDeleteModal}/>
                </MyModal>
            }
        </div>
    );
};

export default VideoDeleteItem;