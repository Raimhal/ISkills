import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {setParams} from "../store/ThemeReducer";
import {GetThemes} from "../functions/Theme";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";

const AdminThemes = () => {
    const themes = useSelector(state => state.theme.themes)
    const params = useSelector(state => state.theme.params)
    const sortList = useSelector(state => state.theme.sortList)
    const totalCount = useSelector(state => state.theme.totalCount)
    const dispatch = useDispatch()

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    const [getThemes, isLoading, error] = GetThemes();

    useEffect( () =>{
        getThemes()
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {!isLoading &&
                <div className="wide main">
                    <h2>Themes</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getThemes}
                        sortList={sortList}
                    />
                    <MyTable items={themes}/>
                    <MyPagination page={params.page} pageSize={params.take} pageCount={themes.length}
                    totalCount={totalCount} changePage={changePage}/>
                </div>
            }
        </div>
    );
};

export default AdminThemes;