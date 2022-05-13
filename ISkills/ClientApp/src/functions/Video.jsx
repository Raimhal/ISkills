import React from 'react';
import {useFetching} from "../hooks/useFetching";
import CourseService from "../API/CourseService";
import {useDispatch, useSelector} from "react-redux";
import VideoService from "../API/VideoService";
import {setVideos, setParams, setTotalCount} from "../store/VideoReducer";

const GetVideos = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.video.params)

    return useFetching(async () => {
        console.log('fetch videos')
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newVideos] = await VideoService.GetVideos({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setVideos(newVideos))
        dispatch(setTotalCount(+totalCount))
    })
};


export {
    GetVideos,
};