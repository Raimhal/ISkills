import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {
    clearError, clearLoading,
    createCategory,
    getCategories,
    removeCategory,
    setCategory,
    setParams,
    updateCategory
} from "../store/CategoryReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import CategoryForm from "../components/category/CategoryForm";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Loading from "../components/UI/Loading/Loading";
import EmptyList from "../components/UI/EmptyList/EmptyList";
import {setLoading} from "../store/ChapterReducer";

const AdminCategories = () => {
    const categories = useSelector(state => state.category.categories)
    const params = useSelector(state => state.category.params)
    const sortList = useSelector(state => state.category.sortList)
    const totalCount = useSelector(state => state.category.totalCount)
    const dispatch = useDispatch()
    const [createModal, setCreateModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const error = useSelector(state => state.category.error)
    const isLoading = useSelector(state => state.chapter.isLoading)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect(() => {
        return () => {
            dispatch(clearLoading())
        }
    }, [])

    useEffect(() => {
        if(categories.length > 0)
            dispatch(setLoading(false))
    }, [categories.length])

    useEffect( () =>{
        dispatch(getCategories())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div className="wide main">
            <div style={{display: "flex", justifyContent: "space-between"}} className="title">
                <h3>Categories</h3>
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
                action={getCategories}
                sortList={sortList}
                isLoading={isLoading}
            />
            {!isLoading ?
                <>
                {totalCount > 0
                    ?
                    <>
                        <MyTable
                            title="chapter"
                            items={categories}
                            remove={removeCategory}
                            updateClick={(category) => {
                                dispatch(clearError())
                                dispatch(setCategory(category))
                                setUpdateModal(true)
                            }}
                            error={error}
                            clearError={() => dispatch(clearError())}
                        />
                        <MyPagination page={params.page} pageSize={params.take} pageCount={categories.length}
                        totalCount={totalCount} changePage={changePage}/>
                    </>
                        : <EmptyList title="No categories found"/>
                }
                </>
                : <Loading/>
            }
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
    );
};

export default AdminCategories;