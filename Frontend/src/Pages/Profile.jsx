import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../authProvider"
import userimage from "../Images/userimage.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import nocover from "../Images/nocover.svg"
import instance from "../ProtectedInstances/axios";
import Cropper from "react-easy-crop";

const Profile = () => {
    const [showUpdateProfileimage, setShowUpdateProfileimage] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [friends, setfriends] = useState([]);

    const { user, setUser } = useContext(AuthContext);

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

    const handleFileChange = (e) => {
  const file = e.target.files[0];
  setProfileImage(file);

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
                setfriends(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getfriends();
    }, [user]);
    

  return (
    <div>
          <h1 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent font-semibold text-3xl ml-10 mb-4 ">{user.userName}</h1>
          <div className="relative">
              <img src={nocover} alt="Cover Image" className="h-40 w-full bg-white" />
              <p className="text-black absolute top-6 right-10 shadow-2xl"><FontAwesomeIcon icon={faPen} /> Update Cover Photo</p>
              <img src={user.profilePic || userimage} alt="User Image" className="absolute top-20 h-30 w-30 rounded-full ml-15 border-gray-400 border shadow-3xl" />
          <button onClick={() => setShowUpdateProfileimage(true)} className="text-white mt-15 ml-10 cursor-pointer"><FontAwesomeIcon icon={faPen} /> Update Profile Photo</button>
          </div>
          {
              showUpdateProfileimage && (
                 < div className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-sm bg-black/30">
                      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50">
                          <div className="bg-white rounded-lg p-8">
                               <div className="flex justify-end">
                              <span onClick={() => setShowUpdateProfileimage(false)} className="text-black text-2xl pb-3"><FontAwesomeIcon icon={faTimes} /></span>
                          </div>
                              <input type="file" onChange={handleFileChange} />
                              {imageSrc && (
  <div className="relative w-75 h-75 mt-4">
    <Cropper
      image={imageSrc}
      crop={crop}
      zoom={zoom}
      aspect={1} // profile pic ku square
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
    />
  </div>
)}
                              <button onClick={handleupdateprof} className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent font-semibold border border-gray-400 rounded-4xl py-2 px-4">Update</button>
                              </div>
                  </div>
                  </div>
              )
        }
          <div className="flex justify-evenly items-center w-full h-full text-center mt-10">
              <div className="flex-1 flex flex-col border border-gray-400 rounded-4xl py-5">
                  <h2 className="text-2xl font-semibold text-white flex justify-evenly mt-2">Username: <span className="text-gray-500 text-xl">{user.userName}</span></h2>
                  <h2 className="text-2xl font-semibold text-white flex justify-evenly mt-2">Name: <span className="text-gray-500 text-xl">{user.name}</span></h2>
                  <h2 className="text-2xl font-semibold text-white flex justify-evenly mt-2">Bio: <span className="text-gray-500 text-xl">{user.bio ? user.bio : "No bio"}</span></h2>
                  <h2 className="text-2xl font-semibold text-white flex justify-evenly mt-2">Location: <span className= "text-gray-500 text-xl">{user.location ? user.location : "No location"}</span></h2>
                  <h2 className="text-2xl font-semibold text-white flex justify-evenly mt-2">Website: <span className="text-gray-500 text-xl">{user.website ? user.website : "No website"}</span></h2>
              </div>
              <div className="flex-1 flex flex-col border border-gray-400 rounded-4xl py-5">
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent font-semibold text-3xl">Friends</h2>
              </div>
          </div>
    </div>
  )
}

export default Profile
