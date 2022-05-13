import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {setParams} from "../store/ChapterReducer";
import {GetChapters} from "../functions/Chapter";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";

const AdminChapters = () => {
    const chapters = useSelector(state => state.chapter.chapters)
    const params = useSelector(state => state.chapter.params)
    const sortList = useSelector(state => state.chapter.sortList)
    const totalCount = useSelector(state => state.chapter.totalCount)
    const dispatch = useDispatch()

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    const [getChapters, isLoading, error] = GetChapters();

    useEffect( () =>{
        getChapters()
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {!isLoading &&
                <div className="wide main">
                    <h2>Chapters</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getChapters}
                        sortList={sortList}
                    />
                    <MyTable items={chapters}/>
                    <MyPagination page={params.page} pageSize={params.take} pageCount={chapters.length}
                    totalCount={totalCount} changePage={changePage}/>
                </div>
            }
        </div>
    );
};

export default AdminChapters;