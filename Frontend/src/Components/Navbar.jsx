import { useContext } from "react";
import { Outlet, useNavigate } from "react-router";
import { AuthContext } from "../../authProvider";
import instance from "../ProtectedInstances/axios";
import toast from "react-hot-toast";
import logo from "../Images/plainbdlogo.svg"

const Navbar = () => {


        const navigate = useNavigate();

    const { user, setUser } = useContext(AuthContext);
    console.log(user);

    const handleLogout = async () => {
        try {
            const res = await instance.post("/auth/logout")
            setUser(null);
            toast.success(res.data.message);
            navigate("/login");
        }
        catch (error){
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        }
    }
  return (
      <>
        <div className="fixed top-0 left-0 w-full h-16 bg-black flex items-center px-10 z-20 pt-4">
    
    <div className="flex-1 flex justify-center">
      <img src={logo} alt="logo" className="h-17 w-17" />
    </div>

    <div className="flex-1 flex justify-center">
      <h1 className="text-white text-xl">
        Hey! <span className="font-semibold">{user ? user.name : "Guest"}</span>
      </h1>
    </div>

    <div className="flex-1 flex justify-center">
      <button
        onClick={handleLogout}
        className="border border-amber-400 text-lg bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent px-4 py-1 rounded-2xl font-semibold"
      >
        profile
      </button>
    </div>

  </div>

  {/* Content below navbar */}
  <div className="mt-16">
    <Outlet />
  </div>
      </>
  )
}

export default Navbar
