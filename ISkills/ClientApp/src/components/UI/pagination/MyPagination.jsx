import React, {useEffect} from 'react';
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import classes from './MyPagination.module.css'
import {getComments} from "../../../store/CommentReducer";

const MyPagination = ({page, pageSize, totalCount, changePage, pageCount}) => {
    useEffect(() => {
        if(totalCount > 0 && !(pageCount > 0))
            if(Math.ceil(totalCount / pageSize) === page - 1)
                changePage(page - 1)
    }, [pageCount])
    return (
        <div className={classes.PaginationWrap}>
            {totalCount > pageSize &&
            <Pagination
                currentPage={page}
                totalSize={totalCount}
                sizePerPage={pageSize}
                changeCurrentPage={changePage}
                theme="border-bottom"
            />
            }
        </div>
    );
};

export default MyPagination;