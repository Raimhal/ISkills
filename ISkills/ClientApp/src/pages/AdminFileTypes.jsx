import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {setParams} from "../store/FileReducer";
import {GetFileTypes} from "../functions/File";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";

const AdminFileTypes = () => {
    const types = useSelector(state => state.file.types)
    const params = useSelector(state => state.file.params)
    const sortList = useSelector(state => state.file.sortList)
    const totalCount = useSelector(state => state.file.totalCount)
    const dispatch = useDispatch()

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    const [getFileTypes, isLoading, error] = GetFileTypes();

    useEffect( () =>{
        getFileTypes()
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {!isLoading &&
                <div className="wide main">
                    <h2>File types</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getFileTypes}
                        sortList={sortList}
                    />
                    <MyTable items={types}/>
                    <MyPagination page={params.page} pageSize={params.take} pageCount={types.length}
                    totalCount={totalCount} changePage={changePage}/>
                </div>
            }
        </div>
    );
};

export default AdminFileTypes;