import React from 'react';
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";
import classes from './MyPagination.module.css'

const MyPagination = ({page, pageSize, totalCount, changePage, pageCount}) => {

    return (
        <div className={classes.PaginationWrap}>
            { totalCount > pageSize &&
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