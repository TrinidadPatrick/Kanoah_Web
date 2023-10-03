import {react} from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './Pages/LoginPage/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
