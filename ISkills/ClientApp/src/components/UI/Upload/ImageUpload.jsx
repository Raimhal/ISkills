import React from 'react';
import MyButton from "../button/MyButton";

const ImageUpload = ({action, submitTitle}) => {
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
            {/*<MyAlert item={error}/>*/}
            <MyButton type="submit">{submitTitle}</MyButton>
        </form>
    )
};

export default ImageUpload;