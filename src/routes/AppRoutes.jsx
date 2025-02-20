import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ErrorPage from '../pages/ErrorPage';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute><Home></Home></PrivateRoute> ,
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