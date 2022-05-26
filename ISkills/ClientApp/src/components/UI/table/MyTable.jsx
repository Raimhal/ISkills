import React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from '@mui/material'
import {randomNumber} from "react-ratings-declarative/build/utils";
import {useDispatch} from "react-redux";
import {Tooltip} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const MyTable = ({items, remove = null, updateClick = null, iconChildren = null}) => {
    const dispatch = useDispatch()

    return (
        <TableContainer component={Paper} id="tableContainer">
            <Table sx={{minWidth: 650, whiteSpace: "nowrap"}} aria-label="simple table" onWheel={(e) => {
                const el = document.querySelector('#tableContainer')
                const scrollPosition = el.scrollLeft
                el.scrollTo({
                    top: 0,
                    left: (scrollPosition + e.deltaY),
                })

            }
            } >

                <TableHead>
                    <TableRow >
                        <TableCell align="left">Actions</TableCell>
                        {Object.keys(items[0] || {})?.map((key) => {
                            if (items[0][key] === null || typeof(items[0][key]) !== 'object') {
                                return <TableCell key={key} align="right">{key}</TableCell>
                            }
                        }
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow
                            key={item.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell align="left">
                                {iconChildren && iconChildren(item.imageUrl, item)}
                                <Tooltip title="Edit" placement="bottom">
                                    <IconButton aria-label="edit" onClick={() => updateClick(item)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" placement="bottom">
                                    <IconButton aria-label="delete" onClick={() => dispatch(remove(item.id))}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            {Object.values(item)?.map(value => (
                                (value === null || typeof(value) !== 'object')
                                && <TableCell
                                    align="right"
                                    key={`${item.id}-${randomNumber()}`}
                                    sx={{overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 350}}
                                >
                                    {value}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MyTable;