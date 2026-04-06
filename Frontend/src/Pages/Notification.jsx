import { useContext, useEffect, useState } from "react";
import socket from "../socketio";
import userimage from "../Images/userimage.svg";
import toast from "react-hot-toast";
import instance from "../ProtectedInstances/axios";
import { AuthContext } from "../../authProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";


const Notification = () => {

    const {user} = useContext(AuthContext);

    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await instance.get("/notification");
        setNotifications(res.data.notifications);
        console.log(res.data.notifications);
    } catch (err) {
      console.log(err);
    }
  };

  fetchNotifications();
    }, []);
    

useEffect(() => {
  socket.on("notification", (data) => {
    toast.success(data.message);

    setNotifications((prev) => [data, ...prev]);
  });

  return () => socket.off("notification");
}, []);



    useEffect(() => {
  if (user?._id) {
    socket.emit("userOnline", user._id);
  }
    }, [user]);
    
  console.log(notifications);
  
  return (
      <>
          <h1 className="text-white lg:text-2xl text-lg mt-2 mb-10"> <span><FontAwesomeIcon icon={faBell} /> </span>Notifications</h1>
          <div>
  {notifications.map((n, index) => (
    <div key={index} className="flex items-center gap-3 bg-gray-800 text-white p-3 my-2 rounded-lg">
      
      <img 
  src={n.senderId?.profilePic || n.profilePic || userimage} 
  className="h-10 w-10 rounded-full border-2 border-[#EA5415]"
/>

<p>
  <span className="font-semibold">
    {n.senderId?.userName}
  </span>{" "}

  {n.type === "comment" && "commented on your post 💬"}
  {n.type === "like" && "liked your post ❤️"}
  {n.type === "friend_request" && "sent you a friend request 🤝"}
</p>

    </div>
  ))}
</div>
      </>
  )
}

export default Notification
