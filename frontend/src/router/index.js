import Courses from "../pages/Courses";
import CoursePage from "../pages/CoursePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import AccountPage from "../pages/AccountPage";
import CourseActionPage from "../pages/CourseActionPage";
import RegisterPage from "../pages/RegisterPage";


const publicRoutes = [
    {path: '/courses', component: <Courses />},
    {path: '/courses/:id', component: <CoursePage />},
    {path: '/login', component: <LoginPage />},
    {path: '/register', component: <RegisterPage />},
    {path: '*', component: <NotFoundPage />},
    {path: '/404', component: <NotFoundPage />}
]

const privateRoutes = [
    {path: '/account', component: <AccountPage />},
]

const adminRoutes = [
    {path: '/admin/courses', component: <AccountPage />},
    {path: '/admin/users', component: <CourseActionPage />},
    {path: '/admin/file-types', component: <CourseActionPage />},
    {path: '/admin/comments', component: <CourseActionPage />},
    {path: '/admin/chapters', component: <CourseActionPage />},
    {path: '/admin/videos', component: <CourseActionPage />},
    {path: '/admin/categories', component: <CourseActionPage />},
    {path: '/admin/themes', component: <CourseActionPage />},
]

export {publicRoutes, privateRoutes, adminRoutes}