import React from 'react';
import {createUser} from "../store/UserReducer";
import RegistrationForm from "../components/user/RegistrationForm";

const RegisterPage = () => {
    return (
        <div className="center">
            <RegistrationForm
                action={createUser}
                submitTitle="Sign up"
                title="Registration"
                className="form register"/>
        </div>
    );
};

export default RegisterPage;