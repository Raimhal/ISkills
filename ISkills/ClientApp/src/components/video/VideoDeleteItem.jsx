import React, {useState} from 'react';
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MyModal from "../UI/MyModal/MyModal";
import ConfirmationForm from "../UI/ConfirmationForm/ConfirmationForm";
import {useDispatch} from "react-redux";
import {clearError} from "../../store/VideoReducer";

const VideoDeleteItem = ({remove}) => {
    const dispatch = useDispatch()
    const [deleteModal, setDeleteModal] = useState(false)
    return (
        <div>
            <IconButton aria-label="delete" onClick={(e) => {
                e.stopPropagation()
                dispatch(clearError())
                setDeleteModal(true)
            }
            }>
                <DeleteIcon/>
            </IconButton>
            {deleteModal &&
                <MyModal visible={deleteModal} setVisible={setDeleteModal} onClick={(e) => {e.stopPropagation()}}>
                    <ConfirmationForm title={"Are you sure you want to delete this video?"} action={(e) => remove(e)} setModal={setDeleteModal}/>
                </MyModal>
            }
        </div>
    );
};

export default VideoDeleteItem;