import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import instance from "../ProtectedInstances/axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";

const Newpost = () => {

    const [loading, setLoading] = useState(false);
    const [showtextpost, setshowtextpost] = useState(false);
    const [showimagepost, setshowimagepost] = useState(false);
    const [showvideopost, setshowvideopost] = useState(false);

    const [text, settext] = useState("");
    const [image, setimage] = useState(null);
    const [video, setvideo] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

    const handleaddpost = async() => {
        try {
            setLoading(true);
            const res = await instance.post("create-post/newpost", { text });
            toast.success("Post Created Successfully");
            settext("");
            setshowtextpost(false);
        }
        catch (error) {
            toast.error("Something went wrong");
        }finally {
        setLoading(false); 
    }
    }

   const handleaddimagepost = async () => {
  try {
    setLoading(true);

    let finalImage = image;

    // 👉 if crop pannirundha
    if (imageSrc && croppedAreaPixels) {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // convert blob to file
      finalImage = new File([croppedBlob], "cropped.jpg", {
        type: "image/jpeg",
      });
    }

    const formData = new FormData();
    formData.append("postPic", finalImage);

    const res = await instance.post(
      "create-post/newpost",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(res.data.message);

    setimage(null);
    setImageSrc(null);
    setshowimagepost(false);
  } catch (error) {
    toast.error(error.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
};
    const handleaddvideopost = async () => {
        try {
             setLoading(true);
            const formData = new FormData();
            formData.append("postVideo", video);

            const res = await instance.post(
  "create-post/newpost",
  formData
);
            toast.success(res.data.message);
            setvideo(null);
            setshowvideopost(false);
        }
        catch (error) {
            toast.error(error.response.data.message);
        }finally {
        setLoading(false); 
    }
    }

       const handleprofileChange = (e) => {
  const file = e.target.files[0];
  setimage(file);

  const reader = new FileReader();
  reader.onload = () => {
    setImageSrc(reader.result);
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


  return (
      <>
          <div className="flex justify-center items-center text-center mt-5">
              <h1 className="text-white lg:text-3xl text-2xl font-semibold"> Add a <span className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent lg:text-3xl text-xl font-semibold">Newpost</span></h1>
          </div>
          <div className="flex md:flex-row flex-col justify-center items-center gap-5 lg:mt-15 mt-7">
              <div className="border border-gray-600 lg:px-4 px-2 lg:py-12 py-6 rounded-3xl w-full flex-1 flex flex-col justify-center items-center bg-gray-900" onClick={() => setshowtextpost(true)}>
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-[18px]">Add a note <span className="text-white"> or </span> feed for post!</h2>
                  <span className="text-white text-center pt-5"><FontAwesomeIcon icon={faPlus} /></span>
              </div>
              <div className="border border-gray-600 lg:px-4 px-2 lg:py-12 py-6 rounded-3xl w-full flex-1 flex flex-col justify-center items-center bg-gray-900" onClick={() => setshowimagepost(true)}>
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-[18px]">Add<span className="text-white"> a </span> Photo!</h2>
                  <span className="text-white text-center pt-5"><FontAwesomeIcon icon={faPlus} /></span>
              </div>
              <div className="border border-gray-600 lg:px-4 px-2 lg:py-12 py-6 rounded-3xl w-full flex-1 flex flex-col justify-center items-center bg-gray-900" onClick={() => setshowvideopost(true)}>
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-[18px]">Add<span className="text-white"> a </span>Video!</h2>
                  <span className="text-white text-center pt-5"><FontAwesomeIcon icon={faPlus} /></span>
              </div>
          </div>
          {
              showtextpost && <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                                <div className="bg-white rounded-lg lg:p-8 p-2 lg:w-xl w-70">
                                                    <div className="flex justify-end">
                                                        <span onClick={() => setshowtextpost(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                      </div>
                      <div className="flex flex-col items-center">
                          <h1 className="text-black text-2xl font-semibold">Add a Note or Feed for Post!</h1>
                          <div className="flex flex-col">
                              <div className="flex flex-col mt-4">
                                  <textarea value={text} onChange={e => settext(e.target.value)} type="text" className="border border-gray-300 h-50 rounded-lg px-2 py-2 lg:w-md w-60" />
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-end mt-4">
                          <button className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-lg font-semibold cursor-pointer text-[22px] mr-3" onClick={handleaddpost}>Add Post</button>
                      </div>
                  </div>
              </div>
          }

          {
              showimagepost && <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                                <div className="bg-white rounded-lg lg:p-8 p-2 w-75 lg:w-xl">
                                                    <div className="flex justify-end">
                                                        <span onClick={() => setshowimagepost(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                      </div>
                      <div className="flex flex-col items-center">
                          <h1 className="text-black text-2xl font-semibold">Add a Photo for Post!</h1>
                          <div className="flex flex-col">
                              <div className="flex flex-col mt-15">
                                  <input type="file" accept="image" className="border border-gray-300 lg:w-85 w-65 px-2 py-1 rounded-2xl"  onChange={handleprofileChange}/>
                              </div>
                              {imageSrc && (
  <div className="relative lg:w-75 w-70 h-75 mt-4">
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
                          </div>
                      </div>
                      <div className="flex justify-end mt-4">
                          <button className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-lg font-semibold cursor-pointer text-[22px] mr-3" onClick={handleaddimagepost}>Add Post</button>
                      </div>
                  </div>
              </div>
          }

          {
              showvideopost && <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                                <div className="bg-white rounded-lg lg:p-8 p-2 lg:w-xl w-75">
                                                    <div className="flex justify-end">
                                                        <span onClick={() => setshowvideopost(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                      </div>
                      <div className="flex flex-col items-center">
                          <h1 className="text-black text-2xl font-semibold">Add a Video for Post!</h1>
                          <div className="flex flex-col">
                              <div className="flex flex-col mt-15">
                                  <input type="file" accept="video/*"  className="border border-gray-300 lg:w-85 w-65 px-2 py-1 rounded-2xl"  onChange={e => setvideo(e.target.files[0])}/>
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-end mt-4">
                          <button className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-lg font-semibold cursor-pointer text-[22px] mr-3" onClick={handleaddvideopost}>Add Post</button>
                      </div>
                  </div>
              </div>
          }
        {loading && (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    
    <div className="flex flex-col items-center gap-4">
      
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      
      <p className="text-white text-lg font-semibold">
        Uploading... 🚀
      </p>

    </div>

  </div>
)}

      </>
  )
}

export default Newpost
