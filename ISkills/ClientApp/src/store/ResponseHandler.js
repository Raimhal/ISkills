export const responseHandler = async (dispatch, action, setError, setLoading) => {
    try {
        dispatch(setLoading(true))
        await action()
        dispatch(setError(null))
    }
    catch (e) {
        dispatch(setError(e.response?.data.error || "error"))
    }
    finally {
        dispatch(setLoading(false))
    }
}