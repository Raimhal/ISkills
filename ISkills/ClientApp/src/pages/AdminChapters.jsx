import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import SortAndSearch from "../components/UI/SortAndSearch/SortAndSearch";
import {getChapters, removeChapter, setChapter, setParams, updateChapter} from "../store/ChapterReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import ChapterForm from "../components/chapter/ChapterForm";

const AdminChapters = () => {
    const chapters = useSelector(state => state.chapter.chapters)
    const params = useSelector(state => state.chapter.params)
    const sortList = useSelector(state => state.chapter.sortList)
    const totalCount = useSelector(state => state.chapter.totalCount)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const error = useSelector(state => state.chapter.error)
    const isLoading = useSelector(state => state.chapter.isLoading)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getChapters())
    }, [params.page, params.sortOption, params.reverse])

    return (
        <div>
            <AdminNavbar/>
            {/*{!isLoading &&*/}
                <div className="wide main">
                    <h2 className="title">Chapters</h2>
                    <SortAndSearch
                        params={params}
                        onParamsChange={value => dispatch(setParams(value))}
                        action={getChapters}
                        sortList={sortList}
                        isLoading={isLoading}
                    />
                    <MyTable
                        title="chapter"
                        items={chapters}
                        remove={removeChapter}
                        updateClick={(chapter) => {
                            dispatch(setChapter(chapter))
                            setModal(true)
                        }}
                    />
                    <MyPagination page={params.page} pageSize={params.take} pageCount={chapters.length}
                    totalCount={totalCount} changePage={changePage}/>
                    {modal &&
                    <MyModal visible={modal} setVisible={setModal}>
                        <ChapterForm action={() => {
                            dispatch(updateChapter(setModal))
                        }} title="Save"/>
                    </MyModal>
                    }
                </div>

            {/*}*/}
        </div>
    );
};

export default AdminChapters;