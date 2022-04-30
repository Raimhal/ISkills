import React from 'react';
import MySelect from "../select/MySelect";
import MyInput from "../input/MyInput";
import MyButton from "../button/MyButton";
import classes from './SortAndSearch.module.css'

const SortAndSearch = ({sortList, params, action, onParamsChange}) => {
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            console.log(params)
            action()
        }} className={classes.div}
        >
            <MySelect
                value={params.sortOption || ""}
                onChange={value => onParamsChange({...params, sortOption: value})}
                defaultValue="Sort by"
                options={sortList}
            />
            <MyInput type="text" defaultValue={params.query} onChange={e => onParamsChange({...params, query: e.target.value})} label="Search"/>
            <MyButton>Search</MyButton>
        </form>
    );
};

export default SortAndSearch;