import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

const AppRoutes = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello world!</div>,
    },
    {
        path: '/auth/login',
        element: <Login></Login>
    },
]);


export default AppRoutes;