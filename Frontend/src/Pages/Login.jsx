import { Link, Navigate, useNavigate } from "react-router"
import logo from "../Images/logo.svg"
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import instance from "../ProtectedInstances/axios";
import { AuthContext } from "../../authProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Login = () => {

    const [authForm, setAuthForm] = useState({ userName: "", passWord: "" });
    const [forgotForm, setForgotForm] = useState({ userName: "", newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    
    const { setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const handlelogin = async () => {
        try {
            const res = await instance.post("/auth/login", 
                {userName: authForm.userName, passWord: authForm.passWord}
            );

            toast.success(res.data.message);
            console.log(res.data);
            setUser(res.data.user);
            navigate("/home")
            setAuthForm({ userName: "", passWord: "" });
        }
        catch (error) {
            const msg = error.response?.data?.message || "Something went wrong";
        toast.error(msg);
        }
    }

    const handleforgot = async () => {
        try {
            
        }
        catch (error) {
        }

    }

  return (
      <>
                    <div className="flex flex-col justify-center items-center mt-10 gap-5">
              <img src={logo} alt="Logo VibeNet" className="h-30 w-30 rounded-full shadow-md"/>
              <h1 className="text-white font-extrabold text-5xl">Welcome <span className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent">Back!</span></h1>
              <h2 className="text-white font-semibold text-2xl m-4"><span className="text-white font-normal text-lg mr-3">Existing User?</span>login Here</h2>
              <form onSubmit={(e) => {e.preventDefault(); handlelogin(); }} className="flex flex-col gap-7 justify-center items-center">
                  <input type="text" value={authForm.userName} onChange={e => setAuthForm({ ...authForm, userName: e.target.value })} placeholder="Username" className="text-white rounded-lg p-2 border border-gray-700 w-md" required/>
                  <input type="password" value={authForm.passWord} onChange={e => setAuthForm({ ...authForm, passWord: e.target.value })} placeholder="Password" className="text-white rounded-lg p-2 border border-gray-700 w-md" required/>
                  <button type="submit" className="border border-amber-400 text-xl bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent w-25 px-2 py-1 rounded-2xl text-center font-semibold">Login</button>
              </form>
              <div className="flex justify-center items-center gap-10 mt-4">
                  <p className="text-white">Not yet registered? <Link to={"/"}><span className="underline font-semibold">Register</span></Link></p>
                  <button className="text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)}>Forgot Password?</button>
              </div>
          </div>
          {showPassword && (
              < div className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-sm bg-black/30">
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50">
                      <div className="bg-white rounded-lg p-8">
                          <div className="flex justify-end">
                              <span><FontAwesomeIcon className="font-bold text-2xl" icon={faTimes} onClick={() => setShowPassword(false)} /></span>
                          </div>
                          <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
                          <form onSubmit={(e) => { e.preventDefault();  handleforgot();}} className="flex flex-col gap-7 justify-center items-center">
                  <input type="text" value={forgotForm.userName} onChange={e => setForgotForm({ ...forgotForm, userName: e.target.value })} placeholder="Username" className="text-black rounded-lg p-2 border border-gray-700 w-md" required/>
                              <input type="password" value={forgotForm.newPassword} onChange={e => setForgotForm({ ...forgotForm, newPassword: e.target.value })} placeholder="New Password" className="rounded-lg p-2 border border-gray-700 w-md text-black" required />
                              <input type="password" value={forgotForm.confirmPassword} onChange={e => setForgotForm({ ...forgotForm, confirmPassword: e.target.value })} placeholder="Confirm Password" className="text-black rounded-lg p-2 border border-gray-700 w-md" required/>
                              <button type="submit" className="border border-amber-400 text-xl bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent w-25 px-2 py-1 rounded-2xl text-center font-semibold">Submit</button>
              </form>
                      </div>
                  </div>
              </div >   
          )}
      </>
  )
}

export default Login
