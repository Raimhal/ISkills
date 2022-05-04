import React, {useEffect, useState} from 'react';
import {Menu, MenuItem, Typography} from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";
import MySelect from "../select/MySelect";
import arrow from '../../../assets/images/downward-arrow.png'
import {useFetching} from "../../../hooks/useFetching";
import ThemeService from "../../../API/ThemeService";
import {setCategories} from "../../../store/CategoryReducer";
import CategoryService from "../../../API/CategoryService";
import {setParams} from "../../../store/CourseReducer";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const NestedMenu = ({label, ...props}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [menuPosition, setMenuPosition] = useState(null);
    const categories = useSelector(state => state.category.categories)
    const params = useSelector(state => state.course.params)

    const [getThemes, isThemesLoading, themesError] = useFetching(async (id) =>{
        const index = categories.findIndex(x => x.id === id)
        categories[index].themes = await ThemeService.GetThemesAll({
            params: {
                categoryId: id
            }
        })
        dispatch(setCategories(categories))
    })

    const [getCategories, isCategoriesLoading, categoriesError] = useFetching(async () =>{
        const categories = await CategoryService.GetCategoriesAll()
        dispatch(setCategories(categories))
    })

    const onHoverItem = async (category) => {
        if(!category.themes?.length > 0){
            getThemes(category.id)
        }
    }

    const onClickItem = (themeId) => {
        setMenuPosition(null);
        dispatch(setParams({...params, themeId: themeId}))
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
        getCategories()
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