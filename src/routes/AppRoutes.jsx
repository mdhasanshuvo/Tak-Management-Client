import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ErrorPage from '../pages/ErrorPage';

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello world!</div>,
    },
    {
        path: '/auth/login',
        element: <Login></Login>
    },
    {
        path: '/auth/register',
        element: <Register></Register>
    },
    {
        path: "*",
        element: <ErrorPage></ErrorPage>
    },
]);


export default AppRoutes;