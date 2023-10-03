import {react} from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './Pages/LoginPage/Login';
import Register from './Pages/Register/Register';
import './index.css'

function App() {
  return (
    <div className="App w-100 h-screen grid place-items-center bg-slate-300">
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Register />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
