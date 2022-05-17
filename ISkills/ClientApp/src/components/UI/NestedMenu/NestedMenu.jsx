import React, {useEffect, useState} from 'react';
import {Menu, MenuItem, Typography} from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";
import {getAllCategories, getCategories, setCategories, setCategory} from "../../../store/CategoryReducer";
import {setParams} from "../../../store/CourseReducer";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getAllThemes, setTheme} from "../../../store/ThemeReducer";

const NestedMenu = ({label, ...props}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [menuPosition, setMenuPosition] = useState(null);
    const categories = useSelector(state => state.category.categories)
    const category = useSelector(state => state.category.category)
    const params = useSelector(state => state.course.params)
    const themes = useSelector(state => state.theme.themes)
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
        setMenuPosition(null);
        dispatch(setParams({...params, themeId: themeId}))
        const theme = category.themes[category.themes.findIndex(x => x.id === themeId)]
        dispatch(setTheme(theme))
        navigate('/courses')
    };



    const handleMouseEnter = (event) => {
        if (menuPosition) {
            return;
        }
        event.preventDefault();
        setMenuPosition({
            top: event.pageY,
            left: event.pageX
        });
    }

    useEffect(() => {
        dispatch(getAllCategories())
    }, [])

    return (
        <div onClick={handleMouseEnter} {...props}>
            <Typography className="paraSelect">
                {label}
            </Typography>
            <Menu
                open={!!menuPosition}
                onClose={() => setMenuPosition(null)}
                anchorReference="anchorPosition"
                anchorPosition={menuPosition}
            >
                <MenuItem disabled>Categories</MenuItem>
                {categories?.map(category =>
                    <NestedMenuItem onMouseEnter={() => onHoverItem(category)}
                                    parentMenuOpen={!!menuPosition} label={category.title} key={category.id}>
                        <MenuItem disabled>Themes</MenuItem>
                        {!isThemesLoading && category.themes?.map(theme =>
                            <MenuItem onClick={() => {
                                onClickItem(theme.id)

                            }} key={theme.id}>{theme.title}</MenuItem>
                        )}
                    </NestedMenuItem>
                )}
            </Menu>
        </div>
    );
};

export default NestedMenu;