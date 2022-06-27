import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {
    clearError,
    createType,
    getFileTypes,
    removeType,
    setFileType,
    setParams,
    updateType
} from "../store/FileReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import FileTypeForm from "../components/file/FileTypeForm";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AdminFileTypes = () => {
    const types = useSelector(state => state.file.types)
    const params = useSelector(state => state.file.params)
    const sortList = useSelector(state => state.file.sortList)
    const totalCount = useSelector(state => state.file.totalCount)
    const dispatch = useDispatch()
    const [createModal, setCreateModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const error = useSelector(state => state.file.error)
    const isLoading = useSelector(state => state.file.isLoading)


    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getFileTypes())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div className="wide main">
            <div style={{display: "flex", justifyContent: "space-between"}} className="title">
                <h3>File types</h3>
                <Tooltip title="Add file type" placement="bottom">
                    <IconButton aria-label="add file type" onClick={() => {
                        dispatch(clearError())
                        setCreateModal(true)
                    }}>
                        <AddBoxIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <SortAndSearch
                params={params}
                onParamsChange={value => dispatch(setParams(value))}
                action={getFileTypes}
                sortList={sortList}
                isLoading={isLoading}
            />
            <MyTable
                title="file type"
                items={types}
                remove={removeType}
                updateClick={(type) => {
                    dispatch(clearError())
                    dispatch(setFileType(type))
                    setUpdateModal(true)
                }}
                error={error}
                clearError={() => dispatch(clearError())}
                forbiddenFields={["id"]}
            />
            <MyPagination page={params.page} pageSize={params.take} pageCount={types.length}
            totalCount={totalCount} changePage={changePage}/>
            {createModal &&
            <MyModal visible={createModal} setVisible={setCreateModal}>
                <FileTypeForm action={() => {
                    dispatch(createType(setCreateModal))
                }} title="Add"/>
            </MyModal>
            }
            {updateModal &&
            <MyModal visible={updateModal} setVisible={setUpdateModal}>
                <FileTypeForm action={() => {
                    dispatch(updateType(setUpdateModal))
                }} title="Save"/>
            </MyModal>
            }
        </div>
    );
};

export default AdminFileTypes;