import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import instance from "../ProtectedInstances/axios";
import toast from "react-hot-toast";

const Newpost = () => {

    const [loading, setLoading] = useState(false);
    const [showtextpost, setshowtextpost] = useState(false);
    const [showimagepost, setshowimagepost] = useState(false);
    const [showvideopost, setshowvideopost] = useState(false);

    const [text, settext] = useState("");
    const [image, setimage] = useState(null);
    const [video, setvideo] = useState(null);

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
            const formData = new FormData();
            formData.append("postPic", image);

            const res = await instance.post("create-post/newpost", formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success(res.data.message);
            setimage(null);
            setshowimagepost(false);
        }
        catch (error) {
            toast.error(error.response.data.message);
        }finally {
        setLoading(false); 
    }
    }

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

  return (
      <>
          <div className="flex justify-center items-center text-center">
              <h1 className="text-white text-3xl font-semibold"> Add a <span className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-3xl font-semibold">Newpost</span></h1>
          </div>
          <div className="flex flex-row justify-center items-center gap-5 mt-15">
              <div className="border border-gray-600 px-4 py-12 rounded-3xl flex-1 flex flex-col justify-center items-center bg-gray-900" onClick={() => setshowtextpost(true)}>
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-[18px]">Add a note <span className="text-white"> or </span> feed for post!</h2>
                  <span className="text-white text-center pt-5"><FontAwesomeIcon icon={faPlus} /></span>
              </div>
              <div className="border border-gray-600 px-4 py-12 rounded-3xl flex-1 flex flex-col justify-center items-center bg-gray-900" onClick={() => setshowimagepost(true)}>
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-[18px]">Add<span className="text-white"> a </span> Photo!</h2>
                  <span className="text-white text-center pt-5"><FontAwesomeIcon icon={faPlus} /></span>
              </div>
              <div className="border border-gray-600 px-4 py-12 rounded-3xl flex-1 flex flex-col justify-center items-center bg-gray-900" onClick={() => setshowvideopost(true)}>
                  <h2 className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent text-[18px]">Add<span className="text-white"> a </span>Video!</h2>
                  <span className="text-white text-center pt-5"><FontAwesomeIcon icon={faPlus} /></span>
              </div>
          </div>
          {
              showtextpost && <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                                                <div className="bg-white rounded-lg p-8 w-xl">
                                                    <div className="flex justify-end">
                                                        <span onClick={() => setshowtextpost(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                      </div>
                      <div className="flex flex-col items-center">
                          <h1 className="text-black text-2xl font-semibold">Add a Note or Feed for Post!</h1>
                          <div className="flex flex-col">
                              <div className="flex flex-col mt-4">
                                  <textarea value={text} onChange={e => settext(e.target.value)} type="text" className="border border-gray-300 h-50 rounded-lg px-2 py-2 w-md" />
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
                                                <div className="bg-white rounded-lg p-8 w-xl">
                                                    <div className="flex justify-end">
                                                        <span onClick={() => setshowimagepost(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                      </div>
                      <div className="flex flex-col items-center">
                          <h1 className="text-black text-2xl font-semibold">Add a Photo for Post!</h1>
                          <div className="flex flex-col">
                              <div className="flex flex-col mt-15">
                                  <input type="file" accept="image" className="border border-gray-300 px-2 py-1 rounded-2xl"  onChange={e => setimage(e.target.files[0])}/>
                              </div>
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
                                                <div className="bg-white rounded-lg p-8 w-xl">
                                                    <div className="flex justify-end">
                                                        <span onClick={() => setshowvideopost(false)} className="text-black text-2xl pb-3 cursor-pointer"><FontAwesomeIcon icon={faTimes} /></span>
                      </div>
                      <div className="flex flex-col items-center">
                          <h1 className="text-black text-2xl font-semibold">Add a Video for Post!</h1>
                          <div className="flex flex-col">
                              <div className="flex flex-col mt-15">
                                  <input type="file" accept="video/*"  className="border border-gray-300 px-2 py-1 rounded-2xl"  onChange={e => setvideo(e.target.files[0])}/>
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
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    
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
