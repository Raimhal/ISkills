import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useFetching} from "../../../hooks/useFetching";
import * as yup from "yup";
import {useFormik} from "formik";
import MyInput from "../input/MyInput";
import {setVideo} from "../../../store/VideoReducer";
import MySelect from "../select/MySelect";
import MyFormikAlert from "../alert/MyFormikAlert";
import MyAlert from "../alert/MyAlert";
import MyButton from "../button/MyButton";

const ImageUpload = ({action, submitTitle}) => {
    const imageAction = (e) => {
        e.preventDefault()
        console.log('upload')
        action()
    }

    return (
        <form className="form" onSubmit={imageAction} id="uploadImage">
            <input
                type="file"
                name="file"
                id="image"
                accept="image/*"
                required
            />
            {/*<MyAlert item={error}/>*/}
            <MyButton type="submit">{submitTitle}</MyButton>
        </form>
    )
};

export default ImageUpload;