export const responseHandler = async (dispatch, action, setError, setLoading) => {
    try {
        dispatch(setLoading(true))
        await action()
        dispatch(setError(null))
    }
    catch (e){
        let error
        if(e.response?.data.error)
            error = e.response?.data.error
        console.log(error)
        dispatch(setError(error || e.message))
    }
    finally {
        dispatch(setLoading(false))
    }
}