import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {createType, getFileTypes, removeType, setFileType, setParams, updateType} from "../store/FileReducer";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";
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


    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getFileTypes())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {/*{!isLoading &&*/}
                <div className="wide main">
                    <div style={{display: "flex", justifyContent: "space-between"}} className="title">
                        <h2>File types</h2>
                        <Tooltip title="Add file type" placement="bottom">
                            <IconButton aria-label="add file type" onClick={() => setCreateModal(true)}>
                                <AddBoxIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getFileTypes}
                        sortList={sortList}
                    />
                    <MyTable
                        items={types}
                        remove={removeType}
                        updateClick={(type) => {
                            dispatch(setFileType(type))
                            setUpdateModal(true)
                        }}
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
            {/*}*/}
        </div>
    );
};

export default AdminFileTypes;