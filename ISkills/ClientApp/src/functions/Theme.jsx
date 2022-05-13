import React from 'react';
import {useFetching} from "../hooks/useFetching";
import CourseService from "../API/CourseService";
import {useDispatch, useSelector} from "react-redux";
import ThemeService from "../API/ThemeService";
import {setThemes, setParams, setTotalCount} from "../store/ThemeReducer";

const GetThemes = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.theme.params)

    return useFetching(async () => {
        console.log('fetch themes')
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newThemes] = await ThemeService.GetThemes({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setThemes(newThemes))
        dispatch(setTotalCount(+totalCount))
    })
};


export {
    GetThemes,
};