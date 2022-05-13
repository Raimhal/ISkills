import React from 'react';
import {useFetching} from "../hooks/useFetching";
import {useDispatch, useSelector} from "react-redux";
import CategoryService from "../API/CategoryService";
import {setCategories, setParams, setTotalCount} from "../store/CategoryReducer";

const GetCategories = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.category.params)

    return useFetching(async () => {
        console.log('fetch categories')
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newCategories] = await CategoryService.GetCategories({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setCategories(newCategories))
        dispatch(setTotalCount(+totalCount))
    })
};


export {
    GetCategories,
};