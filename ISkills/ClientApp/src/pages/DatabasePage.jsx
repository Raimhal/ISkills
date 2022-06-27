import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import MyTable from "../components/UI/Table/MyTable";
import MyPagination from "../components/UI/Pagination/MyPagination";
import {
    clearError,
    createBackup,
    executeRestore,
    getBackups,
    removeBackup,
    setBackup,
    setParams
} from "../store/BackupReducer";
import AdminNavbar from "../components/UI/Navbar/AdminNavbar";
import MyModal from "../components/UI/MyModal/MyModal";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ConfirmationForm from "../components/UI/ConfirmationForm/ConfirmationForm";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CategoryForm from "../components/category/CategoryForm";
import {createCategory} from "../store/CategoryReducer";
import InnerLoading from "../components/UI/Loading/InnerLoading";
import RestoreIcon from '@mui/icons-material/Restore';


const DatabasePage = () => {
    const backups = useSelector(state => state.backup.backups)
    const params = useSelector(state => state.backup.params)
    const totalCount = useSelector(state => state.backup.totalCount)
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false)
    const [createModal, setCreateModal] = useState(false)
    const error = useSelector(state => state.backup.error)
    const isLoading = useSelector(state => state.backup.isLoading)
    const isActionLoading = useSelector(state => state.backup.isActionLoading)

    const changePage = (page) => {
        dispatch(setParams({...params, page: page}))
    }

    useEffect( () =>{
        dispatch(getBackups())
    }, [params.page])

    return (
        <div className="wide main">
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} className="title">
                <h3>Backups</h3>
                <Tooltip title="Create Backup" placement="bottom">
                    <div>
                        {!isActionLoading
                            ?
                                <IconButton aria-label="create backup" onClick={() => dispatch(createBackup())}>
                                    <AddBoxIcon />
                                </IconButton>
                            : <InnerLoading />
                        }
                    </div>
                </Tooltip>
            </div>
            <MyTable
                title="backup"
                items={backups.map(backup => {
                    return {id: backup.url, ...backup}
                })}
                remove={removeBackup}
                iconChildren={ (backup) =>
                    <Tooltip title="Restore" placement="bottom">
                        <IconButton aria-label="execute restore" onClick={() => {
                            dispatch(setBackup(backup))
                            setModal(true)
                        }}>
                            <RestoreIcon />
                        </IconButton>
                    </Tooltip>
                }
                error={error}
                clearError={() => dispatch(clearError())}
                forbiddenFields={["url", "id"]}
            />
            <MyPagination page={params.page} pageSize={params.take} pageCount={backups.length}
            totalCount={totalCount} changePage={changePage}/>
            {modal && <MyModal visible={modal} setVisible={setModal}>
                <ConfirmationForm error={error} title={"Are you sure you want to restore to this backup?"} action={(e) => {
                    e.stopPropagation()
                    dispatch(executeRestore(setModal))
                }} setModal={setModal}/>
            </MyModal>
            }
        </div>
    );
};

export default DatabasePage;