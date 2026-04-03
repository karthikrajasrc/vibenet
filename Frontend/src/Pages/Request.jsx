import { faSearch, faUserCheck, faUserEdit, faUserFriends, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../authProvider"
import instance from "../ProtectedInstances/axios"
import userimage from "../Images/userimage.svg"
import { faUserAlt } from "@fortawesome/free-regular-svg-icons"
import toast from "react-hot-toast"


const Request = () => {

    const { user } = useContext(AuthContext);
    const [allusers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchtext, setSearchtext] = useState("");
    const [receivedRequests, setReceivedRequests] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await instance.get("/request/allusers");
                console.log(res.data);
                setAllUsers(res.data.users);
                setFilteredUsers(res.data.users);
            }
            catch (error) {
                console.log(error);
            }
        }


        fetchAllUsers();

    }, [user]);


useEffect(() => {
  let filtered = allusers.filter(u => u._id !== user._id);

  if (searchtext) {
    filtered = filtered.filter(u =>
      u.userName.toLowerCase().includes(searchtext.toLowerCase())
    );
  }

  setFilteredUsers(filtered);
}, [searchtext, allusers, user._id]);
    
    const handleAddFriend = async (id) => {
        try {
            const res = await instance.post(`/request/send-request/${id}`);   
            toast.success(res.data.message);
        }
        catch (error) {
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);

        }
    }
    
    useEffect(() => {
        const fetchReceivedRequests = async () => {
            try {
                const res = await instance.get(`/request/received-requests`);
                setReceivedRequests(res.data.requests);
                console.log(res.data.requests);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchReceivedRequests();
    }, [user]);

    const handleAccept = async (id) => {
        try {
            const res = await instance.post(`/request/accept-request/${id}`);
            toast.success(res.data.message);
            setReceivedRequests(prev =>
      prev.filter(req => req.from._id !== id)
    );
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleReject = async (id) => {
        try {
            const res = await instance.post(`/request/reject-request/${id}`);
            toast.success(res.data.message);
            setReceivedRequests(prev =>
      prev.filter(req => req.from._id !== id)
    );
        }
        catch {

        }
    }

  return (
      <>
          <div className="flex justify-center items-center text-center gap-10">
              <div className="flex-1 bg-gray-900 rounded-2xl h-full pb-10">
                  <h1 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text pt-5 text-transparent font-semibold text-3xl">Search Friends!</h1>
                  <div className="flex flex-row gap-2 justify-center items-center">
                      <input type="text" value={searchtext} onChange={e => setSearchtext(e.target.value)} placeholder="Search..." className="text-white rounded-lg p-2 mt-5 border border-gray-700 w-md" required />
                      <span className="bg-[#EA5415] px-1 py-2 text-xl rounded-lg mt-5"><FontAwesomeIcon icon={faSearch} /> </span>
                  </div>
                  <div className="mt-7">
                      {
                          filteredUsers.map((u) => {
  const isFriend = (user?.friends || []).includes(u._id.toString());

  return (
    <div key={u._id} className="border border-gray-600 rounded-2xl mx-5 px-5 py-2 mt-2">
      
      <div className="flex flex-row justify-between">

        <div className="flex flex-row gap-5">
          <img src={u.profilePic || userimage} className="w-10 h-10 rounded-full" />
          
          <div className="flex flex-col text-left">
            <h1 className="text-white">{u.userName}</h1>
            <h2 className="text-gray-500">{u.name}</h2>
          </div>
        </div>

        <div className="mt-2 mr-5">
          <span className="text-white text-2xl">
  {isFriend ? (
    <FontAwesomeIcon icon={faUserCheck} className="text-green-700" />
  ) : (
    <button onClick={() => handleAddFriend(u._id)}><FontAwesomeIcon icon={faUserPlus} /></button>
  )}
</span>
        </div>

      </div>

    </div>
  );
})
                      }
                  </div>
              </div>
              <div className="flex-1 bg-gray-900 rounded-2xl max-h-full">
                  <h1 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text py-5 text-transparent font-semibold text-3xl">Requests</h1>
                  <div>
                      {
                          receivedRequests.length === 0 ? (
                              <h1 className="text-white text-2xl pb-4">No Requests</h1>
                          ) : (
                              receivedRequests.map((req) => {
  const sender = req.from;

  return (
    <div key={req._id} className="border border-gray-600 rounded-2xl mx-5 px-5 py-2 my-5">
      
      <div className="flex flex-row justify-between">

        <div className="flex flex-row gap-5">
          <img src={sender.profilePic || userimage} className="w-10 h-10 rounded-full" />
          
          <div className="flex flex-col text-left">
            <h1 className="text-white">{sender.userName}</h1>
            <h2 className="text-gray-500">{sender.name}</h2>
          </div>
        </div>

        <div className="mt-2 mr-5 flex gap-3">
          <button onClick={() => handleAccept(sender._id)}>
            <FontAwesomeIcon icon={faUserCheck} className="text-green-600 text-xl" />
          </button>

          <button onClick={() => handleReject(sender._id)}>
            ❌
          </button>
        </div>

      </div>

    </div>
  );
})
                          )
                      }
                  </div>
              </div>
          </div>
      </>
  )
}

export default Request
