import React from 'react';
import {useFetching} from "../hooks/useFetching";
import CourseService from "../API/CourseService";
import {useDispatch, useSelector} from "react-redux";
import FileService from "../API/FileService";
import {setFileTypes, setParams, setTotalCount} from "../store/FileReducer";

const GetFileTypes = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.file.params)

    return useFetching(async () => {
        console.log('fetch files')
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newFiles] = await FileService.GetFileTypes({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setFileTypes(newFiles))
        dispatch(setTotalCount(+totalCount))
    })
};


export {
    GetFileTypes,
};