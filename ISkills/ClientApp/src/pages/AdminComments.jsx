import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {
    clearError, clearLoading,
    getComments,
    removeComment,
    setComment,
    setComments,
    setParams,
    updateComment
} from "../store/CommentReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import CommentForm from "../components/comment/CommentForm";
import {removeChapter, setChapter} from "../store/ChapterReducer";
import EmptyList from "../components/UI/EmptyList/EmptyList";
import Loading from "../components/UI/Loading/Loading";


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

    useEffect(() => {
        return () => {
            dispatch(clearLoading())
        }
    }, [])

    useEffect( () =>{
        dispatch(getComments())
    }, [params.page, params.sortOption, params.reverse,  !isLoading && comments.length === 0])

    return (
        <div className="wide main">
            <h3 className="title">Comments</h3>
            <SortAndSearch
                params={params}
                onParamsChange={value => dispatch(setParams(value))}
                action={getComments}
                sortList={sortList}
                isLoading={isLoading}
            />

            {!isLoading ?
                <>
                {totalCount > 0
                    ?
                    <>
                        <MyTable
                            title="comment"
                            items={comments}
                            remove={removeComment}
                            updateClick={(comment) => {
                                dispatch(clearError())
                                dispatch(setComment(comment))
                                setModal(true)
                            }}
                            clearError={() => dispatch(clearError())}
                            forbiddenFields={["id"]}
                            error={error}
                        />
                        <MyPagination page={params.page} pageSize={params.take} pageCount={comments.length}
                                      totalCount={totalCount} changePage={changePage}/>
                    </>
                    : <EmptyList title="No comments found"/>
                }
                </>
                : <Loading/>
            }

            {modal &&
                <MyModal visible={modal} setVisible={setModal}>
                    <CommentForm action={() => {
                        dispatch(updateComment(setModal))
                    }} title="Save"/>
                </MyModal>
            }
        </div>
    );
};

export default AdminComments;