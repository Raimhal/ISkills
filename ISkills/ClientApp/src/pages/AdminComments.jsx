import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {setParams} from "../store/CommentReducer";
import {GetComments} from "../functions/Comment";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";

const AdminComments = () => {
    const comments = useSelector(state => state.comment.comments)
    const params = useSelector(state => state.comment.params)
    const sortList = useSelector(state => state.comment.sortList)
    const totalCount = useSelector(state => state.comment.totalCount)
    const dispatch = useDispatch()

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    const [getComments, isLoading, error] = GetComments();

    useEffect( () =>{
        getComments()
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {!isLoading &&
                <div className="wide main">
                    <h2>Comments</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getComments}
                        sortList={sortList}
                    />
                    <MyTable items={comments}/>
                    <MyPagination page={params.page} pageSize={params.take} pageCount={comments.length}
                    totalCount={totalCount} changePage={changePage}/>
                </div>
            }
        </div>
    );
};

export default AdminComments;