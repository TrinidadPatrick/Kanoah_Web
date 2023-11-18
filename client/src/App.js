import {react} from 'react'
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"
import Login from './Pages/LoginPage/Login';
import Register from './Pages/RegisterPage/Register';
import './index.css'
import VerifyEmail from './Pages/VerifyAccountPage/VerifyEmail';
import ForgotPassword from './Pages/ForgotPasswordPage/ForgotPassword';
import MainPage from './Pages/MainPage/MainPage';
import Navbar from './Pages/Navbar/Navbar';
import Map from './Pages/MainPage/Map';
import ViewService from './Pages/ViewService/ViewService';
import CustomerAccount from './Pages/AccountSetting/CustomerAccount';
import ServiceRegistrationPage from './Pages/ServiceRegistration/ServiceRegistrationPage';
import ServiceSettings from './Pages/ServiceSetting/ServiceSettings';
import Explore from './Pages/ExplorePage/Explore';

function App() {
  const NavbarLayout = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );
  return (
    <div className="App w-100  h-fit grid place-items-center bg-slate-400">
      <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />} >
        
        <Route path='/verify' element={<VerifyEmail />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='explore/viewService' element={<ViewService />} />
        <Route path='/myAccount' element={<CustomerAccount />} />
        <Route path='/serviceRegistration' element={<ServiceRegistrationPage />} />
        <Route path='/serviceSettings' element={<ServiceSettings />} />
        <Route path='/' element={<MainPage />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
