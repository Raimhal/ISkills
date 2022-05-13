import {useState} from "react";


export const useFetching = (callback) => {
    let isLoading = false;
    let error = ''

    const fetching = async (...args) => {
        try {
            isLoading = true;
            await callback(...args)
        }
        catch (e) {
            error = e.response?.data.error
        }
        finally {
            isLoading = false
        }
    }


    return [fetching, isLoading, error]
}