import { NavLink, Outlet, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHome, faPlus, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AuthContext } from "../../authProvider";
import instance from "../ProtectedInstances/axios";
import toast from "react-hot-toast";

const Sidebar = () => {

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
          <div className="flex">


  <div className="w-60 h-screen bg-black p-5 fixed top-0 left-0 pt-25">
    <ul className="mt-18 ml-3 space-y-5">
     <NavLink to="/home" end>
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer text-xl mt-5 
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faHome} /> Home
    </li>
  )}
</NavLink>

<NavLink to="/home/profile">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faUser} /> Profile
    </li>
  )}
</NavLink>
                      
<NavLink to="/home/search">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faSearch} /> Search
    </li>
  )}
</NavLink>

<NavLink to="/home/notify">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faHeart} /> Notifications
    </li>
  )}
</NavLink>

<NavLink to="/home/newpost">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faPlus} /> New Post
    </li>
  )}
</NavLink>
    </ul>

    <div className="absolute bottom-10 left-5">
      <button
        onClick={handleLogout}
        className="border border-amber-400 text-lg bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent ml-6 px-4 py-1 rounded-2xl font-semibold"
      >
        Logout
      </button>
    </div>
  </div>

  <div className="ml-60 w-full h-screen overflow-y-auto p-10">
    <Outlet />
  </div>

</div>
      </>
  )
}

export default Sidebar
