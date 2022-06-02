import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {getComments, removeComment, setComment, setComments, setParams, updateComment} from "../store/CommentReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import CommentForm from "../components/comment/CommentForm";


const AdminComments = () => {
    const comments = useSelector(state => state.comment.comments)
    const params = useSelector(state => state.comment.params)
    const sortList = useSelector(state => state.comment.sortList)
    const totalCount = useSelector(state => state.comment.totalCount)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const error = useSelector(state => state.comment.error)
    const isLoading = useSelector(state => state.comment.isLoading)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getComments())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {/*{!isLoading &&*/}
                <div className="wide main">
                    <h2 className="title">Comments</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getComments}
                        sortList={sortList}
                        isLoading={isLoading}
                    />
                    <MyTable
                        items={comments}
                        remove={removeComment}
                        updateClick={(comment) => {
                            dispatch(setComment(comment))
                            setModal(true)
                        }}
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={comments.length}
                    totalCount={totalCount} changePage={changePage}/>
                    {modal &&
                        <MyModal visible={modal} setVisible={setModal}>
                            <CommentForm action={() => {
                                dispatch(updateComment(setModal))
                            }} title="Save"/>
                        </MyModal>
                    }
                </div>
            {/*}*/}
        </div>
    );
};

export default AdminComments;