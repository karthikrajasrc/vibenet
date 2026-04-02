import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../authProvider";
import userimage from "../Images/userimage.svg"
import instance from "../ProtectedInstances/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment, faPaperPlane } from "@fortawesome/free-regular-svg-icons";


const Home = () => {

    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState(0);
    const [comment, setComment] = useState(0);


    useEffect(() => {
        const fetchPosts = async() => {
            try {
                const res = await instance.get("/create-post/get-posts");
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

  return (
      <>
          <h1 className="text-white font-bold text-3xl">Stories</h1>
          <div className="my-5 ml-20">
              <img src={user?.profilePic || userimage} alt="profilePic" className="h-20 w-20 rounded-full border-3 border-[#EA5415]"/>
          </div>
          <div>
              <h2 className="text-white font-bold text-3xl">Posts</h2>
          </div>
          <div>
              {
                  posts.map((post) => (
  <div key={post._id} className="mt-15 ml-20">
    <div className="flex items-center gap-3">
      <img 
        src={post.userId?.profilePic || userimage} 
        className="h-12 w-12 rounded-full border-2 border-[#EA5415]"
      />

      <h3 className="text-white font-semibold">
        {post.userId?.userName}
      </h3>
    </div>
                          <div className="bg-gray-900 max-w-xl flex flex-col justify-center items-center rounded-3xl mt-3">
                              {post.text && (
      <p className="text-white font-semibold mt-2">
        {post.text}
      </p>
    )}
    {post.image && (
      <img 
        src={post.image} 
        className="h-100 w-80 rounded-md mt-2"
      />
    )}
    {post.video && (
      <video 
        src={post.video} 
        controls 
        className="h-100 w-150 rounded-md mt-2"
      />
                              )}
                              <div className="my-5">
                                  <span><FontAwesomeIcon icon={faHeart} className="text-white text-2xl" /><span className="text-[#EA5415] text-2xl ml-1 mr-4">{likes }</span></span>
                                  <span><FontAwesomeIcon icon={faComment} className="text-white text-2xl"/><span className="text-[#EA5415] text-2xl ml-1 mr-4">{comment }</span></span>
      </div>
                              </div>

  </div>
))
              }
          </div>
      </>
  )
}

export default Home
