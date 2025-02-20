import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ErrorPage from '../pages/ErrorPage';
import PrivateRoute from './PrivateRoute';

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute><div>Hello world!</div></PrivateRoute> ,
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