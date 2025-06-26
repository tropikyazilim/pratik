import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router";

import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import CariEkle from "./pages/Cari/CariEkle";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Root />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "cariekle", element: <CariEkle /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    
      <RouterProvider router={router} />
    
  );
}

export default App;
