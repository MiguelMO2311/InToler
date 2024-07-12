import { Navigate, Outlet } from 'react-router-dom';


function PublicRoutes() {
    const user = { name: '' };
    //  const user = null
    if (user) return <Outlet />

    return <Navigate to="booksPage" />

}

export default PublicRoutes;
