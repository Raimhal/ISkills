import React from 'react';
import {useFetching} from "../hooks/useFetching";
import CourseService from "../API/CourseService";
import {useDispatch, useSelector} from "react-redux";
import UserService from "../API/UserService";
import {setUsers, setParams, setTotalCount} from "../store/UserReducer";

const GetUsers = () => {
    const dispatch = useDispatch()
    const params = useSelector(state => state.user.params)

    return useFetching(async () => {
        console.log('fetch users')
        if(params.query === '')
            delete params.query
        const newParams = {
            ...params,
            skip: (params.page - 1) * params.take
        }
        const [totalCount, newUsers] = await UserService.GetUsers({
            params: newParams
        })
        dispatch(setParams(newParams))
        dispatch(setUsers(newUsers))
        dispatch(setTotalCount(+totalCount))
    })
};


export {
    GetUsers,
};