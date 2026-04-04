import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../authProvider"
import instance from "../ProtectedInstances/axios";
import userimage from "../Images/userimage.svg"
import socket from "../socketio";

const Message = () => {

  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
    
  useEffect(() => {

    const fetchFriends = async () => {
      try {
        const res = await instance.get("/request/friends");
        setFriends(res.data.friends);
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchFriends();
  }, [user]);

  useEffect(() => {
  if (user?._id) {
    socket.emit("userOnline", user._id);
  }
  }, [user]);

  useEffect(() => {
  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const res = await instance.get(
        `/message/${selectedUser._id}?me=${user._id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchMessages();
}, [selectedUser, user._id]);
  
const handleSend = async () => {
  if (!message.trim() || !selectedUser) return;

  const newMsg = {
    senderId: user._id,
    receiverId: selectedUser._id,
    text: message
  };

  socket.emit("sendMessage", newMsg);

  setMessages((prev) => [...prev, newMsg]);
  setMessage("");
};
  
  useEffect(() => {
  const handleMessage = (data) => {
    console.log("Incoming:", data);

    if (
      selectedUser &&
      (data.senderId === selectedUser._id ||
        data.receiverId === selectedUser._id)
    ) {
      setMessages((prev) => [...prev, data]);
    }
  };

  socket.on("getMessage", handleMessage);

  return () => {
    socket.off("getMessage", handleMessage);
  };
}, [selectedUser]);
  



  return (
    <>
      <div>
      <h1 className="text-white text-3xl font-bold">Messages</h1>
      </div>
      <div className="flex flex-row">
        <div className="mt-5 flex-1">
          <div>
            <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent py-4 text-2xl">Friends</h2>
          </div>
          {
            friends.map((friend) => (
              <div key={friend._id} onClick={() => setSelectedUser(friend)} className="px-4 py-2 border border-gray-700 my-2 cursor-pointer bg-gray-900 rounded-2xl">
                <div className="flex items-center gap-5">
                  <img src={friend.profilePic || userimage} alt="profile" className="h-10 w-10 rounded-full" />
                  <h1 className="text-white text-xl">{friend.userName}</h1>
                </div>
                
              </div>
            ))
          }
        </div>
        <div className="flex-3 p-4">
  {
    selectedUser ? (
      <div>
        <h2 className="text-white text-xl mb-4">
          Chat with <span className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent font-bold">{selectedUser.userName}</span>
        </h2>

       <div className="h-100 overflow-y-auto p-2 bg-gray-900 rounded-xl">
  {
    messages.map((msg, i) => (
      <div
        key={i}
        className={`my-2 flex ${
          msg.senderId === user._id ? "justify-end" : "justify-start"
        }`}
      >
        <span className="bg-blue-600 text-white px-3 py-1 rounded-xl">
          {msg.text}
        </span>
      </div>
    ))
  }
</div>

        <div className="flex mt-3 gap-2">
          <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type message..."
  className="flex-1 p-2 rounded bg-gray-700 text-white outline-none"
/>
          <button className="bg-blue-600 px-4 rounded text-white" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    ) : (
      <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent py-4 text-2xl">Start a conversation!</h2>
    )
  }
</div>
      </div>
    </>
  )
}

export default Message
