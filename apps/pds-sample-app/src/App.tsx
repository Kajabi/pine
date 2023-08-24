import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Login } from './components/Login/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  }
])
const App = () => {
  return (
    <div className="App">
     <RouterProvider router={router} />
    </div>
  )
}

export default App
