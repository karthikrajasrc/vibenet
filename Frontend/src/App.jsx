import { createBrowserRouter, RouterProvider } from "react-router"
import Register from "./Pages/register"
import Login from "./Pages/login"
import Home from "./Pages/Home"
import { Toaster } from "react-hot-toast";
import PublicRoute from "./Routes/publicRoutes";
import ProtectedRoute from "./Routes/protectedRoute";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Profile from "./Pages/Profile";
import Notification from "./Pages/Notification";
import Newpost from "./Pages/Newpost";
import Search from "./Pages/Search";



const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute> <Register /> </PublicRoute>
    }, {
      path: "/login",
      element: <PublicRoute> <Login /> </PublicRoute>
    }, {
      path: "/home",
      element: <Navbar />,
      children: [
        {
          path: "/home",
          element: <ProtectedRoute> <Sidebar /> </ProtectedRoute>, 
          children: [
            {
              path: "",
              element:  <Home />
            }, {
              path: "profile",
              element:  <Profile />
            }, {
              path: "notify",
              element:  <Notification />
            }, {
              path: "newpost",
              element: <Newpost />
            }, {
              path: "search",
              element: <Search />
            }
          ]
        }
      ]
    }
  ])
  return (
    <>
      <Toaster position="top-center"
  toastOptions={{
    style: {
      background: "#1f2937",
      color: "#fff",
    },
  }} />
      <RouterProvider router={router} />
    </>
  )
}

export default App
