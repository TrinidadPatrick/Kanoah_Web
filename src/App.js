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
import Chat from './Pages/ChatSystem/Chat';
import PageNotFound from './Pages/NotFoundPage/PageNotFound';
import EditService from './Pages/EditService/EditService';
import ChatPractice from './Pages/Chat(Development)/ChatPractice';
import BookService from './Pages/BookService/BookService';
import AdminMainPage from './AdminPage/AdminManagement';
import SideBar from './AdminPage/SideBar';
import AdminLogin from './AdminPage/AdminLogin';
import { AuthProvider } from './AdminPage/CustomHooks/AuthProvider';
import AdminList from './AdminPage/AdminList';
import AdminDashboard from './AdminPage/AdminDashboard';
import AdminManagement from './AdminPage/AdminManagement';
import ChatProvider from './ClientCustomHook/ChatProvider';


const App = () => {

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
        
        <Route element={<div className="App w-full h-screen  flex flex-col pt-[4.5rem]">
        
          {NavbarLayout}

          </div>}>   
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/explore/' element={<Explore />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='explore/viewService/:serviceId' element={<ViewService />} />
        <Route path='/myAccount/:optn' element={<CustomerAccount />} />
        <Route path='/serviceRegistration' element={<ServiceRegistrationPage />} />
        <Route path='/serviceSettings/:option' element={<ServiceSettings />} />
        <Route path=':setting/editService/:option' element={<EditService />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path='/' element={<MainPage scrollToAboutUs={scrollToAboutUs} setScrollToAboutUs={setScrollToAboutUs} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/BookService' element={<BookService />} />
        <Route path='/chatP' element={<ChatPractice />} />    
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
        </Route>
        
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
