import React from 'react';
import {useFetching} from "../hooks/useFetching";
import CourseService from "../API/CourseService";
import {useDispatch, useSelector} from "react-redux";
import ChapterService from "../API/ChapterService";
import {setChapters, setParams, setTotalCount} from "../store/ChapterReducer";

const GetChapters = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.chapter.params)

    return useFetching(async () => {
        console.log('fetch chapters')
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newChapters] = await ChapterService.GetChapters({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setChapters(newChapters))
        dispatch(setTotalCount(+totalCount))
    })
};


export {
    GetChapters,
};