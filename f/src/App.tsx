import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "@/context/auth-context";

import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import CariEkle from "./pages/Cari/CariEkle";
import Login from "./pages/Login";
import { KullaniciEkle } from "./pages/Kullanicilar";

import ProtectedRoute from "./components/ProtectedRoute";
import Kitaplik from "./pages/Kitaplik";

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
          { path: "kullaniciekle", element: <KullaniciEkle /> },
          { path: "kitaplik", element: <Kitaplik /> },
        ],
      },
    ],
  },
]);


function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
