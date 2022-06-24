import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from '@mui/material'
import {randomNumber} from "react-ratings-declarative/build/utils";
import {useDispatch} from "react-redux";
import {Tooltip} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MyModal from "../MyModal/MyModal";
import ConfirmationForm from "../ConfirmationForm/ConfirmationForm";
import ModalTableCell from "./ModalTableCell";


const MyTable = ({title, items, remove = null, updateClick = null, iconChildren = null, error = null, clearError = null, forbiddenFields = []}) => {
    const dispatch = useDispatch()

    return (
        <TableContainer component={Paper} id="tableContainer">
            <Table sx={{minWidth: "fit-content", whiteSpace: "nowrap"}}
                   className="correct__overflow"
                   aria-label="simple table"
                   // onWheel={(e) => {
                   //      e.stopPropagation()
                   //      const el = document.querySelector('#tableContainer')
                   //      const scrollPosition = el.scrollLeft
                   //      el.scrollTo({
                   //          top: 0,
                   //          left: (scrollPosition + e.deltaY),
                   //      })
                   // }}
            >

                <TableHead>
                    <TableRow >
                        <TableCell align="left">Actions</TableCell>

                        {Object.keys(items[0] || {})?.map((key) => {
                            if ((typeof(items[0][key]) !== 'object' && !forbiddenFields.includes(key))) {
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
                            <TableCell align="left" style={{display: "flex"}}>
                                {iconChildren && iconChildren(item)}
                                {updateClick &&
                                    <Tooltip title="Edit" placement="bottom">
                                        <IconButton aria-label="edit" onClick={() => updateClick(item)}>
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                }
                                {remove &&
                                    <ModalTableCell clearError={clearError} error={error} title={title} remove={() => dispatch(remove(item.id))}/>
                                }
                            </TableCell>
                            {Object.keys(item)?.map(key =>
                                (typeof(item[key]) !== 'object' && !forbiddenFields.includes(key))
                                && <TableCell
                                    align="right"
                                    key={`${item.id}-=${randomNumber()}`}
                                    sx={{overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 350}}
                                >
                                    {item[key] === "" || isNaN(item[key])  ? !isNaN(Date.parse(item[key])) ? new Date(item[key]).toLocaleString() : item[key] : Math.round(item[key] * 100) / 100 }
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MyTable;