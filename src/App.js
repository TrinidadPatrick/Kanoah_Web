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
import Chat from './Pages/ChatSystem/Chat';
import PageNotFound from './Pages/NotFoundPage/PageNotFound';

function App() {
  const NavbarLayout = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );
  return (
    <div className="App w-100  h-fit grid place-items-center ">
      <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />} >
        
        {/* <Route path='/verify' element={<VerifyEmail />} /> */}
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/explore/' element={<Explore />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='explore/viewService/:serviceId' element={<ViewService />} />
        <Route path='/myAccount/:optn' element={<CustomerAccount />} />
        <Route path='/serviceRegistration' element={<ServiceRegistrationPage />} />
        <Route path='/serviceSettings/:option' element={<ServiceSettings />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path='/' element={<MainPage />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
