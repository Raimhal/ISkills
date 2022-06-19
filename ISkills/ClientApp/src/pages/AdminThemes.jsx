import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {createTheme, getThemes, removeTheme, setParams, setTheme, updateTheme} from "../store/ThemeReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import ThemeForm from "../components/theme/ThemeForm";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AdminThemes = () => {
    const themes = useSelector(state => state.theme.themes)
    const params = useSelector(state => state.theme.params)
    const sortList = useSelector(state => state.theme.sortList)
    const totalCount = useSelector(state => state.theme.totalCount)
    const dispatch = useDispatch()
    const [createModal, setCreateModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const error = useSelector(state => state.theme.error)
    const isLoading = useSelector(state => state.theme.isLoading)


    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getThemes())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {/*{!isLoading &&*/}
                <div className="wide main">
                    <div style={{display: "flex", justifyContent: "space-between"}} className="title">
                        <h2>Themes</h2>
                        <Tooltip title="Add file type" placement="bottom">
                            <IconButton aria-label="add file type" onClick={() => setCreateModal(true)}>
                                <AddBoxIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getThemes}
                        sortList={sortList}
                        isLoading={isLoading}
                    />
                    <MyTable
                        title="theme"
                        items={themes}
                        remove={removeTheme}
                        updateClick={(theme) => {
                            dispatch(setTheme(theme))
                            setUpdateModal(true)
                        }}
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={themes.length}
                    totalCount={totalCount} changePage={changePage}/>
                    {createModal &&
                    <MyModal visible={createModal} setVisible={setCreateModal}>
                        <ThemeForm action={() => {
                            dispatch(createTheme(setCreateModal))
                        }} title="Add"/>
                    </MyModal>
                    }
                    {updateModal &&
                    <MyModal visible={updateModal} setVisible={setUpdateModal}>
                        <ThemeForm action={() => {
                            dispatch(updateTheme(setUpdateModal))
                        }} title="Save"/>
                    </MyModal>
                    }
                </div>
            {/*}*/}
        </div>
    );
};

export default AdminThemes;