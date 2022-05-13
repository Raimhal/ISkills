import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {setParams} from "../store/CategoryReducer";
import {GetCategories} from "../functions/Category";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";

const AdminCategories = () => {
    const categories = useSelector(state => state.category.categories)
    const params = useSelector(state => state.category.params)
    const sortList = useSelector(state => state.category.sortList)
    const totalCount = useSelector(state => state.category.totalCount)
    const dispatch = useDispatch()

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    const [getCategories, isLoading, error] = GetCategories();

    useEffect( () =>{
        getCategories()
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {!isLoading &&
                <div className="wide main">
                    <h2>Categories</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getCategories}
                        sortList={sortList}
                    />
                    <MyTable items={categories}/>
                    <MyPagination page={params.page} pageSize={params.take} pageCount={categories.length}
                    totalCount={totalCount} changePage={changePage}/>
                </div>
            }
        </div>
    );
};

export default AdminCategories;