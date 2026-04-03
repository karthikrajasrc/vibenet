import { use, useContext, useEffect, useState } from "react"
import { AuthContext } from "../../authProvider"
import userimage from "../Images/userimage.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faPaperPlane, faPen, faPlus, faTimes, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import nocover from "../Images/nocover.svg"
import instance from "../ProtectedInstances/axios";
import Cropper from "react-easy-crop";
import { faSignalMessenger } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router";

const Profile = () => {
   const { user, setUser } = useContext(AuthContext);
    const [showUpdateProfileimage, setShowUpdateProfileimage] = useState(false);
    const [showupdateCoverimage, setShowupdateCoverimage] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [showudpate, setShowUpdate] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setbio] = useState(user.bio || "");
  const [location, setlocation] = useState(user.location || "");
  const [website, setwebsite] = useState(user.website || "");
  const [viewProfile, setViewProfile] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [posts, setPosts] = useState([]);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [friends, setfriends] = useState([]);

   

const handleupdateprof = async () => {
  const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

  const formData = new FormData();
  formData.append("profilePic", croppedImage);

  try {
    const res = await instance.post("/request/upload-profile", formData, {
      withCredentials: true,
    });
      console.log(res.data);
       setUser((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(croppedImage)
    }));
    setShowUpdateProfileimage(false);
  } catch (error) {
    console.log(error);
  }
    };
    
const handleupdateCover = async () => {
  const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

  const formData = new FormData();
  formData.append("coverPic", croppedImage);

  try {
    const res = await instance.post("/request/upload-cover", formData, {
      withCredentials: true,
    });

    setUser((prev) => ({
      ...prev,
      coverPic: res.data.coverPic
    }));

    setShowupdateCoverimage(false);
  } catch (error) {
    console.log(error);
  }
};

    const handleprofileChange = (e) => {
  const file = e.target.files[0];
  setProfileImage(file);

  const reader = new FileReader();
  reader.onload = () => {
    setImageSrc(reader.result); // preview
  };
  reader.readAsDataURL(file);
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        setCoverImage(file);
    
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result); // preview
        };
        reader.readAsDataURL(file);
          };
    
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
  setCroppedAreaPixels(croppedAreaPixels);
};

    const getCroppedImg = async (imageSrc, crop) => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
    };


    useEffect(() => {
        const getfriends = async () => {
            try {
                const res = await instance.get("/request/friends");
                setfriends(res.data.friends);
            } catch (error) {
                console.log(error);
            }
        };
        getfriends();
    }, [user]);
    
  const handleupdate = async () => {
    try {
     
      const res = await instance.put("/request/update-profile", {
        name,
        bio,
        location,
        website,
      });
      console.log(res.data);
      setUser((prev) => ({
        ...prev,
        name,
        bio,
        location,
        website,
      }));
      setShowUpdate(false);
      toast.success("Udpated successfully");
    }
    catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
  if (showUpdateProfileimage || showupdateCoverimage || showudpate) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
  }, [showUpdateProfileimage, showupdateCoverimage, showudpate]);

  useEffect(() => {
        const fetchPosts = async() => {
            try {
                const res = await instance.get(`/create-post/get-posts/${user._id}`);
                setPosts(res.data.posts);
                console.log(res.data);
            }
            catch (error) {
                const msg = error.response?.data?.message || "Something went wrong";
                toast.error(msg);
            }
        }

        fetchPosts();
  }, []);
  
  const handleDeletepost = async (id) => {
    try {
      const res = await instance.delete(`create-post/delete/${id}`);
      toast.success(res.data.message);
      const updatedPosts = posts.filter((post) => post._id !== id);
      setPosts(updatedPosts);
    }
    catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div>
          <h1 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent font-semibold text-3xl ml-10 mb-4 ">{user.userName}</h1>
          <div className="relative">
              <img src={user.coverPic || nocover} alt="Cover Image" className="h-40 w-full bg-white" />
              <button onClick={() => setShowupdateCoverimage(true)} className="text-black absolute top-6 right-10 shadow-2xl cursor-pointer"><FontAwesomeIcon icon={faPen} /> Update Cover Photo</button>

               {
              showupdateCoverimage && (
                 < div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                          <div className="bg-white rounded-lg p-8">
                               <div className="flex justify-end">
                              <span onClick={() => setShowupdateCoverimage(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                          </div>
                              <input type="file" onChange={handleCoverChange} />
                              {imageSrc && (
  <div className="relative w-full max-w-150 h-75 mt-4">
    <Cropper
      image={imageSrc}
      crop={crop}
      zoom={zoom}
     aspect={16 / 9} 
     objectFit="horizontal-cover"
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
    />
  </div>
)}
                              <button onClick={handleupdateCover} className="cursor-pointer bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent font-semibold border border-gray-400 rounded-4xl py-2 px-4">Update</button>
                              </div>
                  </div>
              )
        }
              

              <img src={user.profilePic || userimage} alt="User Image" className="absolute top-20 h-30 w-30 rounded-full ml-15 border-gray-400 border shadow-3xl" />
          <button onClick={() => setShowUpdateProfileimage(true)} className="text-white mt-15 ml-10 cursor-pointer"><FontAwesomeIcon icon={faPen} /> Update Profile Photo</button>
          </div>
          {
              showUpdateProfileimage && (
                 < div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                          <div className="bg-white rounded-lg p-8">
                               <div className="flex justify-end">
                              <span onClick={() => setShowUpdateProfileimage(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                          </div>
                              <input type="file" onChange={handleprofileChange} />
                              {imageSrc && (
  <div className="relative w-75 h-75 mt-4">
    <Cropper
      image={imageSrc}
      crop={crop}
      zoom={zoom}
      aspect={1} 
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
    />
  </div>
)}
                              <button onClick={handleupdateprof} className="cursor-pointer bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent font-semibold border border-gray-400 rounded-4xl py-2 px-4">Update</button>
                              </div>
                  </div>
              )
        }
          <div className="flex justify-evenly items-start w-full text-center mt-10 gap-15">
              <div className="flex-1 flex flex-col border border-gray-400 rounded-4xl py-5 text-left">
                  <h2 className="text-2xl font-semibold text-gray-500 flex justify-evenly mt-2 text-left px-5 mx-5 py-1 border border-gray-400 rounded-2xl bg-gray-900">Username: <span className="text-white text-xl">{user.userName}</span></h2>
                  <h2 className="text-2xl font-semibold text-gray-500 flex justify-evenly mt-2 text-left px-5 mx-5 py-1 border border-gray-400 rounded-2xl bg-gray-900">Name: <span className="text-white text-xl">{user.name}</span></h2>
                  <h2 className="text-2xl font-semibold text-gray-500 flex justify-evenly mt-2 text-left px-5 mx-5 py-1 border border-gray-400 rounded-2xl bg-gray-900">Bio: <span className="text-white text-xl">{user.bio ? user.bio : "No bio"}</span></h2>
                  <h2 className="text-2xl font-semibold text-gray-500 flex justify-evenly mt-2 px-5 mx-5 py-1 border border-gray-400 rounded-2xl bg-gray-900">Location: <span className= "text-white text-xl">{user.location ? user.location : "No location"}</span></h2>
          <h2 className="text-2xl font-semibold text-gray-500 flex justify-evenly mt-2 px-5 mx-5 py-1 border border-gray-400 rounded-2xl bg-gray-900">Website: <span className="text-white text-xl">{user.website ? user.website : "No website"}</span></h2>
          <button onClick={() => setShowUpdate(true)} className="cursor-pointer mx-auto mt-5 border border-amber-400 text-lg bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent px-4 py-1 rounded-2xl font-semibold"><FontAwesomeIcon icon={faPen} className="text-white" /> Update</button>
        </div>
        
        {
            showudpate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                          <div className="bg-white rounded-lg p-8">
                               <div className="flex justify-end">
                              <span onClick={() => setShowUpdate(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                  </div>
                  <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-400 rounded-2xl py-2 px-4 w-full mb-4" />
                  <input type="text" placeholder="Bio" value={bio} onChange={(e) => setbio(e.target.value)} className="border border-gray-400 rounded-2xl py-2 px-4 w-full mb-4" />
                  <input type="text" placeholder="Location" value={location} onChange={(e) => setlocation(e.target.value)} className="border border-gray-400 rounded-2xl py-2 px-4 w-full mb-4" />
                  <input type="text" placeholder="Website" value={website} onChange={(e) => setwebsite(e.target.value)} className="border border-gray-400 rounded-2xl py-2 px-4 w-full mb-4" />
                  <div>
                  <button onClick={handleupdate} className="cursor-pointer mx-auto mt-5 border border-amber-400 text-lg bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent px-4 py-1 rounded-2xl font-semibold"><FontAwesomeIcon icon={faPen} className="text-black" /> Update</button>
              </div>
                </div>
          </div>
        )}
              <div className="flex-1 flex flex-col border border-gray-400 rounded-4xl py-5">
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text mb-3 text-transparent font-semibold text-3xl">Friends</h2>
                  {friends.map((friend) => (
                      <div key={friend._id} className="flex items-center mb-4 px-5 mx-5 py-1 border border-gray-400 rounded-2xl bg-gray-900">
                          <img src={friend.profilePic || userimage} alt="Friend Image" className="h-10 w-10 rounded-full mr-2" />
                          <div className="flex justify-between items-center w-full">
                              <div className="ml-2">
                              <h3 className="text-white font-semibold text-lg">{friend.userName}</h3>
                              <p className="text-gray-500 text-sm">{friend.name}</p>
                              </div>
                              <div className="flex gap-5">
                          <div className="relative group">
                            <Link to={"/home/message"} ><button className="cursor-pointer"><span className="text-white text-2xl"><FontAwesomeIcon icon={faPaperPlane} /></span></button></Link>
                            <span className="absolute left-0 -top-3.5 -translate-y-1/2 bg-white text-black text-sm px-2 py-1 rounded 
  opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
    Message
  </span>
                          </div>
                          <div className="relative group">
                            <button className="cursor-pointer" onClick={() => { setViewProfile(true); setSelectedFriend(friend); }}><span className="text-white text-2xl"><FontAwesomeIcon icon={faUser} /></span></button>
                            <span className="absolute left-0 -top-3.5 -translate-y-1/2 bg-white text-black text-sm px-2 py-1 rounded 
  opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
    View Profile
  </span>
                                  </div>
                              </div>
                      </div>
                      {
                          viewProfile && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                  <div className="bg-white rounded-lg p-8">
                                      <div className="flex justify-end">
                                          <span onClick={() => setViewProfile(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                                      </div>
                              <div className="flex items-center mb-4 px-5 mx-5 py-1 border border-gray-400 rounded-2xl  bg-gray-900 relative">
                                <img src={selectedFriend.coverPic || nocover} alt="Cover Image" className="h-20 w-120 bg-white rounded-2xl" />
                                <img src={selectedFriend.profilePic || userimage} alt="Friend Image" className="h-18 w-18 rounded-full mr-5 absolute top-15 ml-5" />
                                          <div className="flex justify-evenly items-center w-full">
                                              <div className="ml-2">
                                                  <h3 className=" font-semibold text-2xl text-white">{selectedFriend.userName}</h3>
                                    <p className="text-gray-500 text-md">{selectedFriend.name}</p>
                                    
                                  </div>
                                  <Link to={"/home/message"} ><button className="cursor-pointer"><span className="text-white text-2xl"><FontAwesomeIcon icon={faPaperPlane} /></span></button></Link>
                                          </div>
                              </div>
                              <div className="bg-black/30 mt-15 rounded-2xl flex flex-col p-5">
                                <h2 className="text-black">Bio: <span className="font-semibold text-[22px]">{selectedFriend.bio || "No Bio"}</span></h2>
                                <h2 className="text-black">Location: <span className="font-semibold text-[22px]">{selectedFriend.location || "No Location"}</span></h2>
                                <h2>Website: <span className="font-semibold text-[22px]">{selectedFriend.website || "No Website"}</span></h2>
                              </div>
                                  </div>
                              </div>
                          )
                      }
                      </div>
                  ))}
              </div>
      </div>
      <div className="mt-10">
        <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text mb-3 text-transparent font-semibold text-3xl">Posts</h2>
        <div className="grid grid-cols-3 gap-2 px-2">
                      {
                          posts.map((post) => (
          <div key={post._id} className="mt-10 ml-20">
                              <div className="bg-gray-900 max-w-xl flex flex-col justify-center items-center rounded-3xl mt-3 h-full">
                                <div className="flex justify-end right-0">
                                  <button className="text-white text-lg" onClick={() => handleDeletepost(post._id)}><FontAwesomeIcon icon={faTrashCan} /> </button>
                                </div>
                                      {post.text && (
              <p className="text-white font-semibold mt-2 px-5 py-10">
                {post.text}
              </p>
            )}
            {post.image && (
              <img 
                src={post.image} 
                className="h-50 w-50 rounded-md mt-2"
              />
            )}
            {post.video && (
              <video 
                src={post.video} 
                controls 
                className="h-50 w-90 rounded-md mt-2"
              />
                                      )}
                                  </div>
          </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default Profile
