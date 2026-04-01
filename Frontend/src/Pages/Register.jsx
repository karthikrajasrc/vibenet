import { Link, useNavigate } from "react-router"
import logo from "../Images/logo.svg"
import instance from "../ProtectedInstances/axios";
import toast from "react-hot-toast";
import { useState} from "react";

const Register = () => {

    const navigate = useNavigate();
    const [authForm, setAuthForm] = useState({ name: "", userName: "", passWord: "" });

    const handleregister = async () => {
        try {
            const res = await instance.post("/auth/register", 
                {name: authForm.name, userName: authForm.userName, passWord: authForm.passWord}
            );

            toast.success(res.data.Message);
            console.log(res.data);
            navigate("/login")
            setAuthForm({ name: "", userName: "", passWord: "" });
        }
        catch (error) {
            const msg = error.response?.data?.message || "Something went wrong";
        toast.error(msg);
        }
    }

  return (
      <>
          <div className="flex flex-col justify-center items-center mt-10 gap-5">
              <img src={logo} alt="Logo VibeNet" className="h-30 w-30 rounded-full shadow-md"/>
              <h1 className="text-white font-extrabold text-5xl">Welcome To <span className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent">VibeNet</span></h1>
              <h2 className="text-white font-semibold text-2xl m-4"><span className="text-white font-normal text-lg mr-3">New User?</span>Register Here</h2>
              <form onSubmit={(e) => {e.preventDefault(); handleregister(); }} className="flex flex-col gap-7 justify-center items-center">
                  <input type="text" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Name" className="text-white rounded-lg p-2 border border-gray-700 w-md" required/>
                  <input type="text" value={authForm.userName} onChange={e => setAuthForm({ ...authForm, userName: e.target.value })} placeholder="Username" className="text-white rounded-lg p-2 border border-gray-700 w-md" required/>
                  <input type="password" value={authForm.passWord} onChange={e => setAuthForm({ ...authForm, passWord: e.target.value })} placeholder="Password" className="text-white rounded-lg p-2 border border-gray-700 w-md" required/>
                  <button type="submit" className="border border-amber-400 text-xl bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent w-25 px-2 py-1 rounded-2xl text-center font-semibold">Register</button>
              </form>
              <p className="text-white">Already have an account? <Link to={"/login"}><span className="underline font-semibold">Login</span></Link></p>
          </div>
      </>
  )
}

export default Register
