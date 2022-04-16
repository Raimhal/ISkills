import Courses from "../pages/Courses";
import CoursePage from "../pages/CoursePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import AccountPage from "../pages/AccountPage";


const publicRoutes = [
    {path: '/courses', component: <Courses />},
    {path: '/courses/:id', component: <CoursePage />},
    {path: '/login', component: <LoginPage />},
    {path: '*', component: <NotFoundPage />},
]

const privateRoutes = [
    {path: '/account', component: <AccountPage />},
]

export {publicRoutes, privateRoutes}