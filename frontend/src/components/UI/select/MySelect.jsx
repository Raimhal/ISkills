import React from 'react';
import classes from './MySelect.module.css'
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {colorTheme} from "../themes";
import {ThemeProvider} from "@emotion/react";

const MySelect = ({options, defaultValue, value, onChange}) => {
    return (
        <ThemeProvider theme={colorTheme}>
            <FormControl
                variant="standard"
                sx={{ alignItems: "bottom", minWidth: 120 }}
            >
                <InputLabel id="demo-simple-select-standard-label">{defaultValue}</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    label={defaultValue}
                >
                    {options.map(option =>
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