import { NavLink, Outlet, useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHeart, faHome, faPaperPlane, faPen, faPlus, faSearch, faSliders, faSlidersH, faUser } from "@fortawesome/free-solid-svg-icons";
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
              localStorage.removeItem("token");
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
        <div className="lg:w-60 w-15 z-10 h-screen bg-black lg:p-5 p-2 fixed top-0 left-0 lg:pt-25 pt-20">
    <ul className="mt-20 ml-3 space-y-5">
     <NavLink to="/home" end>
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer pt-2 text-xl mt-5 
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faHome} /> <span className="lg:block hidden">Home</span>
    </li>
  )}
</NavLink>

<NavLink to="/home/profile">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer pt-2 text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faUser} /> <span className="lg:block hidden">Profile</span>
    </li>
  )}
</NavLink>

<NavLink to="/home/message">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer pt-2 text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faPaperPlane} /> <span className="lg:block hidden">Message</span>
    </li>
  )}
</NavLink>
            

<NavLink to="/home/request">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer pt-2 text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faSearch} /> <span className="lg:block hidden">Request</span>
    </li>
  )}
</NavLink>

<NavLink to="/home/notify">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer pt-2 text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faBell} /> <span className="lg:block hidden">Notifications</span>
    </li>
  )}
</NavLink>

<NavLink to="/home/newpost">
  {({ isActive }) => (
    <li className={`flex gap-3 items-center cursor-pointer pt-2 text-xl mt-5
      ${isActive ? "text-orange-400" : "text-white hover:text-orange-400"}`}>
      
      <FontAwesomeIcon icon={faPlus} /> <span className="lg:block hidden">New Post</span>
    </li>
  )}
</NavLink>
    </ul>

    <div className="absolute bottom-15 lg:left-5 left-1">
      <button
        onClick={handleLogout}
        className="border border-amber-400 lg:text-lg text-xs bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent lg:ml-6 lg:px-4 px-2 py-1 rounded-2xl font-semibold"
      >
        Logout
      </button>
    </div>
  </div>

  <div className="lg:ml-60 ml-10 lg:w-[calc(100%-240px)] w-[calc(100%-50px)] min-h-screen overflow-y-auto lg:p-10 pl-5">
    <Outlet />
  </div>

</div>
      </>
  )
}

export default Sidebar
