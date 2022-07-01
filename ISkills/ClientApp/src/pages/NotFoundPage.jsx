import React from 'react';
import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-page-content">
                <h2>404</h2>
                <p>Page not found</p>
                <Link to="/" class="link">Go back to homepage</Link>
            </div>
        </div>
    );
};

export default NotFoundPage;