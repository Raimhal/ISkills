import React from 'react';
import {Route, Routes} from "react-router-dom";
import Courses from "../pages/Courses";
import NotFoundPage from "../pages/NotFoundPage";
import CoursePage from "../pages/CoursePage";

const AppRouter = () => {
    return (
        <div>
            <Routes>
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CoursePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
};

export default AppRouter;