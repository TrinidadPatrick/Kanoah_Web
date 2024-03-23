import {react, useState ,useMemo} from 'react'
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
import PageNotFound from './Pages/NotFoundPage/PageNotFound';
import EditService from './Pages/EditService/EditService';
import Chat from './Pages/ChatSystem/Chat';
import BookService from './Pages/BookService/BookService';
import AdminMainPage from './AdminPage/AdminCategoryManagement/AdminManagement';
import SideBar from './AdminPage/SideBar';
import AdminLogin from './AdminPage/AdminLogin';
import { AuthProvider } from './AdminPage/CustomHooks/AuthProvider';
import AdminList from './AdminPage/AdminList/AdminList';
import AdminDashboard from './AdminPage/AdminDashboard/AdminDashboard';
import AdminManagement from './AdminPage/AdminCategoryManagement/AdminManagement';
import UserAllServices from './ClientCustomHook/AllServiceProvider';
import { UseServiceHook } from './ClientCustomHook/AllServiceContext';
import GcashPay from './Pages/GcashPayment/GcashPay';
import PaypalPay from './Pages/GcashPayment/PaypalPay';
import AdminServices from './AdminPage/AdminServices/AdminServices';
import AdminViewService from './AdminPage/AdminServices/AdminViewService';
import AdminUsersList from './AdminPage/AdminUserList/AdminUsersList';
import AdminReportList from './AdminPage/AdminReports/AdminReportList';
import AdminReportHistory from './AdminPage/AdminReports/AdminReportHistory';


const App = () => {
  const { services } = UseServiceHook();
  // const {services} = ''
  const [scrollToAboutUs, setScrollToAboutUs] = useState(false);

  const handleScrollToAboutUs = () => {
    setScrollToAboutUs(true)
  };
  const NavbarLayout = useMemo(()=>(
    <>
    <Navbar onAboutUsClick={()=>setScrollToAboutUs(true)} />
    <Outlet />   
  </>
  ),[handleScrollToAboutUs])

  const SidebarLayout = () => (
    <>
      <SideBar />
      <Outlet />
    </>
  );

  return (
      
      <Routes>
        
        <Route element={<div className="App w-full h-[100svh]  flex flex-col pt-[4.5rem]">
        
          {NavbarLayout}

          </div>}>   
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/explore/' element={
        <Explore services={services} />} />
        <Route path='explore/viewService/:serviceId' element={<ViewService />} />
        <Route path='/myAccount/:optn' element={<CustomerAccount />} />
        <Route path='/serviceRegistration' element={<ServiceRegistrationPage />} />
        <Route path='/serviceSettings/:option' element={<ServiceSettings />} />
        <Route path=':setting/editService/:option' element={<EditService />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path='/' element={<MainPage services={services} scrollToAboutUs={scrollToAboutUs} setScrollToAboutUs={setScrollToAboutUs} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/BookService' element={<BookService />} />
        <Route path='/Gcash' element={<GcashPay />} />
        <Route path='/Paypal' element={<PaypalPay />} />
        <Route path='/chat' element={<Chat />} />    
        </Route>

        {/* Admin route */}
        <Route element={
        <div className={`w-full h-screen flex`}>
        <AuthProvider>
        <SidebarLayout />  
        </AuthProvider>
        </div>
        }>

        <Route path='admin/Admins' element={<AuthProvider><AdminList /></AuthProvider>} />
        <Route path='admin/Dashboard' element={<AuthProvider><AdminDashboard /></AuthProvider>} />
        <Route path='admin/Management' element={<AuthProvider><AdminManagement /></AuthProvider>} />
        <Route path='admin/Services' element={<AuthProvider><AdminServices /></AuthProvider>} />
        <Route path='admin/Users' element={<AuthProvider><AdminUsersList /></AuthProvider>} />
        <Route path='admin/Reports/Pending' element={<AuthProvider><AdminReportList /></AuthProvider>} />
        <Route path='admin/Reports/History' element={<AuthProvider><AdminReportHistory /></AuthProvider>} />
        </Route>

        <Route path='admin/Services/AdminViewService/:_id' element={<AuthProvider><AdminViewService /></AuthProvider>} />
        
        <Route path='adminLogin' element={
        <div className='w-full h-screen flex'>
          <AuthProvider>
          <AdminLogin />
          </AuthProvider>   
        </div>
        
        } />
      </Routes>


  );
}

export default App;
