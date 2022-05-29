import React from 'react';
import MyButton from "../Button/MyButton";
import Loading from "../Loading/Loading";
import MyAlert from "../Alert/MyAlert";

const ImageUpload = ({action, error, isLoading, submitTitle}) => {
    const imageAction = (e) => {
        e.preventDefault()
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
            <MyAlert item={error}/>
            <MyButton type="submit">{!isLoading ? submitTitle : <Loading/>}</MyButton>
        </form>
    )
};

export default ImageUpload;