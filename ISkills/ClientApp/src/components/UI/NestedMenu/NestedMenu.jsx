import React, {useEffect, useState} from 'react';
import {Menu, MenuItem, Typography} from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";
import {getAllCategories, getCategories, setCategories, setCategory} from "../../../store/CategoryReducer";
import {setParams} from "../../../store/CourseReducer";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getAllThemes, setTheme} from "../../../store/ThemeReducer";
import {ButtonToolbar, Dropdown} from "rsuite";

const NestedMenu = ({label, ...props}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const categories = useSelector(state => state.category.categories)
    const category = useSelector(state => state.category.category)
    const params = useSelector(state => state.course.params)
    const themes = useSelector(state => state.theme.themes)
    const theme = useSelector(state => state.theme.theme)
    const isThemesLoading = useSelector(state => state.theme.isLoading)

    const getThemes = async (id) => {
        await dispatch(getAllThemes(id))
    }

    const onHoverItem = async (category) => {
        if(!(category.themes?.length > 0))
            await getThemes(category.id)

        dispatch(setCategory(category))
    }

    const onClickItem = (themeId) => {
        if(themeId === theme.id)
            return
        dispatch(setParams({...params, themeId: themeId}))
        const newTheme = category.themes[category.themes.findIndex(x => x.id === themeId)]
        dispatch(setTheme(newTheme))
        navigate("/")
    };

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    return (
        <ButtonToolbar>
            <Dropdown size="md" title="Categories" onOpen={() => console.log('open')} trigger={["click"]} onSelect={() => console.log("select")}>
                <Dropdown.Item disabled>Categories</Dropdown.Item>
                {categories?.map(category =>
                    <div key={category.id} onMouseEnter={() => onHoverItem(category)}>
                        <Dropdown.Menu title={category.title} eventKey={category.id}>
                            {!isThemesLoading && <>
                                <Dropdown.Item disabled>Themes</Dropdown.Item>
                                {category?.themes?.map(t =>
                                    <Dropdown.Item key={t.id} eventKey={t.id} onClick={() => onClickItem(t.id)} active={theme?.id === t.id}>{t.title}</Dropdown.Item>
                                )}
                            </>}
                        </Dropdown.Menu>
                    </div>
                )}
            </Dropdown>
        </ButtonToolbar>
    );
};

export default NestedMenu;