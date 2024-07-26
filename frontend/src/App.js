import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import Vendor from './pages/Vendor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<PrivateRoute element={<Admin />} />} />
        <Route path='/vendor' element={<PrivateRoute element={<Vendor />} />} />
      </Routes>
    </div>
  );
}

export default App;