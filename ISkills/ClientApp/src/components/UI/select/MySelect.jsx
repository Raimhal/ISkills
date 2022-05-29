import React from 'react';
import classes from './MySelect.module.css'
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {colorTheme} from "../Themes";
import {ThemeProvider} from "@emotion/react";

const MySelect = ({options, defaultValue, value, onChange, ...props}) => {
    return (
        <ThemeProvider theme={colorTheme}>
            <FormControl
                variant="outlined"
                sx={{ alignItems: "bottom", minWidth: 120}}
                style={{fontSize: "inherit", fontFamily: "inherit"}}
                {...props}
            >
                <InputLabel id="demo-simple-select-standard-label" sx={{fontSize: "inherit", fontFamily: "inherit", color: "inherit"}}>{defaultValue}</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    label={defaultValue}
                    sx={{fontSize: "inherit"}}
                >

                    {options?.map(option =>
                        <MenuItem value={option.value} key={option.value}>
                            {option.name}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        </ThemeProvider>
    );
};

export default MySelect;