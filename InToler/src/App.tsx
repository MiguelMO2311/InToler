import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Header from './components/Header';
import LogIn from './pages/LogIn';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/UserContext';
import Pagina404 from './pages/ErrorPage404';
import PublicRoutes from './components/PublicRoutes';
import PrivateRoutes from './components/PrivateRoutes';
import CardCreation from './pages/CardsPage';
import AddCard from './pages/AddCard';
import EditCard from './pages/EditCard';

function App() {
  return (
    <UserProvider> {/* Envuelve tu aplicación con UserProvider */}
      <div className="flex flex-col min-h-svh min-w-full bg-slate-100">
        <Header />
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/edit-card/:card_id" Component={EditCard} />

            <Route path="*" element={<Pagina404 />} />

            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
            </Route>

            <Route element={<PrivateRoutes />}>
              <Route path="/cardsPage" element={<CardCreation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/addCard" element={<AddCard />} />
              <Route path="/editCard" element={<EditCard />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;
