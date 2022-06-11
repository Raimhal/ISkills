export const responseHandler = async (dispatch, action, setError, setLoading) => {
    try {
        dispatch(setLoading(true))
        await action()
        dispatch(setError(null))
    }
    catch (e) {
        dispatch(setError(e.response?.data.error || "Error"))
    }
    finally {
        dispatch(setLoading(false))
    }
}