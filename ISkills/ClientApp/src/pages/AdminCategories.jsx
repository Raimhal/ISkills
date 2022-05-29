import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {
    createCategory,
    getCategories,
    removeCategory,
    setCategory,
    setParams,
    updateCategory
} from "../store/CategoryReducer";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import CategoryForm from "../components/category/CategoryForm";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AdminCategories = () => {
    const categories = useSelector(state => state.category.categories)
    const params = useSelector(state => state.category.params)
    const sortList = useSelector(state => state.category.sortList)
    const totalCount = useSelector(state => state.category.totalCount)
    const dispatch = useDispatch()
    const [createModal, setCreateModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const error = useSelector(state => state.category.error)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getCategories())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {/*{!isLoading &&*/}
                <div className="wide main">
                    <div style={{display: "flex", justifyContent: "space-between"}} className="title">
                        <h2>Categories</h2>
                        <Tooltip title="Add file type" placement="bottom">
                            <IconButton aria-label="add file type" onClick={() => setCreateModal(true)}>
                                <AddBoxIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getCategories}
                        sortList={sortList}
                    />
                    <MyTable
                        items={categories}
                        remove={removeCategory}
                        updateClick={(category) => {
                            dispatch(setCategory(category))
                            setUpdateModal(true)
                        }}
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={categories.length}
                    totalCount={totalCount} changePage={changePage}/>
                    {createModal &&
                    <MyModal visible={createModal} setVisible={setCreateModal}>
                        <CategoryForm action={async () => {
                            await dispatch(createCategory(setCreateModal))
                        }} title="Add"/>
                    </MyModal>
                    }
                    {updateModal &&
                    <MyModal visible={updateModal} setVisible={setUpdateModal}>
                        <CategoryForm action={async () => {
                            await dispatch(updateCategory(setUpdateModal))
                        }} title="Save"/>
                    </MyModal>
                    }
                </div>
            {/*}*/}
        </div>
    );
};

export default AdminCategories;