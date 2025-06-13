import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router";


import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import CariEkle from "./pages/Cari/CariEkle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "cariekle", element: <CariEkle /> },
    
    ],
  },
]);

function App() {
  return (
    
      <RouterProvider router={router} />
    
  );
}

export default App;
