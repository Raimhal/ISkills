import Courses from "../pages/Courses";
import CoursePage from "../pages/CoursePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import AccountPage from "../pages/AccountPage";
import RegisterPage from "../pages/RegisterPage";
import AdminCourses from "../pages/AdminCourses";
import AdminThemes from "../pages/AdminThemes";
import AdminUsers from "../pages/AdminUsers";
import AdminCategories from "../pages/AdminCategories";
import AdminComments from "../pages/AdminComments";
import AdminChapters from "../pages/AdminChapters";
import AdminVideos from "../pages/AdminVideos";
import AdminFileTypes from "../pages/AdminFileTypes";
import DatabasePage from "../pages/DatabasePage";
import StatisticsPage from "../pages/StatisticsPage";


const publicRoutes = [
    {path: '/', component: <Courses />},
    {path: '/courses/:id', component: <CoursePage />},
    {path: '/login', component: <LoginPage />},
    {path: '/register', component: <RegisterPage />},
    {path: '/404', component: <NotFoundPage />}
]

const privateRoutes = [
    {path: '/account', component: <AccountPage />},
]

const adminRoutes = [
    {path: '/admin/users', component: <AdminUsers />, title: 'Users'},
    {path: '/admin/comments', component: <AdminComments />, title: 'Comments'},
    {path: '/admin/courses', component: <AdminCourses />, title: 'Courses'},
    {path: '/admin/chapters', component: <AdminChapters />, title: 'Chapters'},
    {path: '/admin/videos', component: <AdminVideos />, title: 'Videos'},
    {path: '/admin/file-types', component: <AdminFileTypes />, title: 'FileTypes'},
    {path: '/admin/themes', component: <AdminThemes />, title: 'Themes'},
    {path: '/admin/categories', component: <AdminCategories />, title: 'Categories'},
    {path: '/backups', component: <DatabasePage />, title: 'Backups'},
    {path: '/statistic', component: <StatisticsPage />, title: 'Statistic'},
]

export {publicRoutes, privateRoutes, adminRoutes}