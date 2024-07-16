import { Navigate, Outlet } from 'react-router-dom';


function PublicRoutes() {
    const user = { name: '' };
    //  const user = null
    if (user) return <Outlet />

    return <Navigate to="cardsPage" />

}

export default PublicRoutes;
