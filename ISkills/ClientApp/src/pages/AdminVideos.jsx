import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {setParams} from "../store/VideoReducer";
import {GetVideos} from "../functions/Video";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";
import Loading from "../components/UI/Loading/Loading";

const AdminVideos = () => {
    const videos = useSelector(state => state.video.videos)
    const params = useSelector(state => state.video.params)
    const sortList = useSelector(state => state.video.sortList)
    const totalCount = useSelector(state => state.video.totalCount)
    const dispatch = useDispatch()

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    const [getVideos, isLoading, error] = GetVideos();

    useEffect( () =>{
        getVideos()
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div style={{position: "relative"}}>
            <AdminNavbar/>
            {isLoading &&
                <Loading/>
            }
                <div className="wide main">
                    <h2>Videos</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getVideos}
                        sortList={sortList}
                    />
                    <MyTable items={videos}/>
                    <MyPagination page={params.page} pageSize={params.take} pageCount={videos.length}
                    totalCount={totalCount} changePage={changePage}/>
                </div>
        </div>
    );
};

export default AdminVideos;