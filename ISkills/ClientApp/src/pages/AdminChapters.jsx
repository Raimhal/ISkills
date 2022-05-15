import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/table/MyTable";
import MyPagination from "../components/UI/pagination/MyPagination";
import SortAndSearch from "../components/UI/sortAndSearch/SortAndSearch";
import {getChapters, removeChapter, setChapter, setParams, updateChapter} from "../store/ChapterReducer";
import AdminNavbar from "../components/UI/navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import ChapterForm from "../components/chapter/ChapterForm";

const AdminChapters = () => {
    const chapters = useSelector(state => state.chapter.chapters)
    const params = useSelector(state => state.chapter.params)
    const sortList = useSelector(state => state.chapter.sortList)
    const totalCount = useSelector(state => state.chapter.totalCount)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)

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
                    />
                    <MyTable
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
                            dispatch(updateChapter())
                            setModal(false)
                        }} title="Save"/>
                    </MyModal>
                    }
                </div>

            {/*}*/}
        </div>
    );
};

export default AdminChapters;