import React from 'react';
import MySelect from "../Select/MySelect";
import MyInput from "../Input/MyInput";
import MyButton from "../Button/MyButton";
import classes from './SortAndSearch.module.css'
import SearchIcon from '@mui/icons-material/Search';
import {IconButton, ToggleButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {Tooltip} from "@material-ui/core"
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined'
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import {useDispatch} from "react-redux";

const SortAndSearch = ({sortList, params, action, onParamsChange}) => {
    const dispatch = useDispatch()
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            dispatch(action())
        }} className={classes.div}
        >
            <div style={{display: "flex", alignItems: "end", gap: "inherit", padding: 0}}>
            <MySelect
                value={params.sortOption || ""}
                onChange={value => onParamsChange({...params, sortOption: value})}
                defaultValue="Sort by"
                options={sortList}
            />
            <Tooltip title="Reverse">
                <ToggleButton
                    value="toggle"
                    selected={params.reverse}
                    onChange={() => onParamsChange({...params, reverse: !params.reverse})}
                    sx={{border: "none", background: 'transparent !important', m: 0, p: 0}}
                >
                    {params.reverse
                        ? <ArrowCircleUpOutlinedIcon />
                        : <ArrowCircleDownOutlinedIcon />
                    }
                </ToggleButton>
            </Tooltip>
            </div>
            <MyInput type="text" value={params.query || ""} onChange={e => onParamsChange({...params, query: e.target.value})} label="Search"/>
            <Tooltip title="Search">
                <IconButton type="submit">
                    <SearchIcon />
                </IconButton>
            </Tooltip>
        </form>
    );
};

export default SortAndSearch;