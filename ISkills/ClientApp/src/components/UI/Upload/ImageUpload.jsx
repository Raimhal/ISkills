import React from 'react';
import MyButton from "../button/MyButton";
import Loading from "../loading/Loading";
import MyAlert from "../alert/MyAlert";

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