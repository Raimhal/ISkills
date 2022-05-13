export const responseHandler = async (dispatch, action, setError, setLoading) => {
    try {
        dispatch(setLoading(true))
        await action()
    }
    catch (e) {
        dispatch(setError(e.response?.data.error))
    }
    finally {
        dispatch(setLoading(false))
    }
}