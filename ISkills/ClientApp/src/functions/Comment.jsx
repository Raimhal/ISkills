import React from 'react';
import {useFetching} from "../hooks/useFetching";
import CourseService from "../API/CourseService";
import {useDispatch, useSelector} from "react-redux";
import CommentService from "../API/CommentService";
import {setComments, setParams, setTotalCount} from "../store/CommentReducer";

const GetComments = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.comment.params)

    return useFetching(async () => {
        console.log('fetch comments')
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newComments] = await CommentService.GetComments({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setComments(newComments))
        dispatch(setTotalCount(+totalCount))
    })
};


export {
    GetComments,
};