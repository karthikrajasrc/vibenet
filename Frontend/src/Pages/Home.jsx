import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../authProvider";
import userimage from "../Images/userimage.svg"
import instance from "../ProtectedInstances/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid, faPen, faTimes, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import socket from "../socketio";


const Home = () => {

    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState([]);
  
  const [showComment, setShowComment] = useState(false);
  const [postId, setPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showEditComment, setShowEditComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");


    useEffect(() => {
        const fetchPosts = async() => {
            try {
                const res = await instance.get("/create-post/get-posts");
                setPosts(res.data.posts);
                setLikes(res.data.likes);
            }
            catch (error) {
                const msg = error.response?.data?.message || "Something went wrong";
                toast.error(msg);
            }
        }

        fetchPosts();
    }, []);
  
  const handleLikes = async (id) => {
  try {
    await instance.post(`/create-post/like/${id}`);

  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";
    toast.error(msg);
  }
  };

const handleComment = async (commentId) => {
  try {
    await instance.post(`/create-post/comment/${commentId}`, {
      text: commentText
    });
    setCommentText("");
    setShowComment(false);
  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";
    toast.error(msg);
  }
};
  
  useEffect(() => {
  socket.on("postLiked", ({ postId, userId }) => {

    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
         const alreadyLiked = post.likes.some(
  (id) => id.toString() === userId
);

          return {
            ...post,
            likes: alreadyLiked
              ? post.likes.filter((id) => id !== userId)
              : [...post.likes, userId],
          };
        }
        return post;
      })
    );

  });

  return () => socket.off("postLiked");
  }, []);
  
  useEffect(() => {
  socket.on("newComment", ({ postId, comment }) => {

    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
           comment: [...(post.comment || []), comment]
          };
        }
        return post;
      })
    );

  });

  return () => socket.off("newComment");
  }, []);
  
  const handleFetchComments = async (id) => {
    try {
      const res = await instance.get(`/create-post/get-comment/${id}`);
      setComment(res.data.comments);
      console.log(res.data.comments);
    }
    catch (error){
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  }

  const handleDeleteComment = async (commentId, postId) => {
  try {
    await instance.delete(`/create-post/delete-comment/${postId}/${commentId}`);

    setComment((prev) => prev.filter((c) => c._id !== commentId));

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              comment: (post.comment || []).filter((c) => c._id !== commentId),
            }
          : post
      )
    );

    toast.success("Comment deleted");

  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";
    toast.error(msg);
  }
};

  const handleEditComment = async (postId, editCommentId) => {
    try {
      const res = await instance.put(`/create-post/update-comment/${postId}/${editCommentId}`, {
        text: editComment
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comment: (post.comment || []).map((c) =>
                  c._id === editCommentId ? { ...c, text: editComment } : c
                ),
              }
            : post
        )
      );
      setShowEditComment(false);
      setEditComment("");
      setEditCommentId(null);
      toast.success("Comment updated");
      
    }
    catch (error){
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  }
  
  return (
      <>
          <h1 className="text-white font-bold text-3xl">Stories</h1>
          <div className="my-5 ml-20">
              <img src={user?.profilePic || userimage} alt="profilePic" className="h-20 w-20 rounded-full border-3 border-[#EA5415]"/>
          </div>
          <div>
              <h2 className="text-white font-bold text-3xl">Posts</h2>
          </div>
      <div className="flex flex-row gap-5">
        <div className="flex-1">
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
      <p className="text-white font-semibold mt-2 pt-4 text-center">
        {post.text}
      </p>
    )}
    {post.image && (
      <img 
        src={post.image} 
        className="h-80 w-80 rounded-md mt-2"
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
                                  <button onClick={() => handleLikes(post._id)} className="cursor-pointer"><FontAwesomeIcon 
  icon={post.likes.includes(user._id) ? faHeartSolid : faHeart} 
  className={post.likes.includes(user._id) ? "text-red-500 text-2xl" : "text-white text-2xl"} 
/><span className="text-[#EA5415] text-2xl ml-1 mr-4">{post.likes.length }</span></button>
                                  <button onClick={() => {setShowComment(true); setPostId(post._id); handleFetchComments(post._id);}} className="cursor-pointer"><FontAwesomeIcon icon={faComment} className="text-white text-2xl"/><span className="text-[#EA5415] text-2xl ml-1 mr-4">{post.comment?.length || 0 }</span></button>
      </div>
                              </div>

  </div>
))
        }
        </div>
        




      <div className="flex-1">
        {showComment && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

    {/* Modal */}
    <div className="bg-gray-900 w-125 max-h-[80vh] rounded-2xl flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <h2 className="text-white text-xl font-bold">Comments</h2>
        <FontAwesomeIcon 
          icon={faTimes} 
          className="text-white cursor-pointer"
          onClick={() => setShowComment(false)} 
        />
      </div>


      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">

        {comment.length === 0 && (
          <p className="text-gray-400 text-center">No comments yet</p>
        )}

        {comment.map((com) => (
          <div key={com._id} className="flex items-start gap-3">

            <img 
              src={com.userId?.profilePic || userimage} 
              className="h-10 w-10 rounded-full border-2 border-[#EA5415]" 
            />

            <div className="flex-1">
              <p className="text-white text-md font-semibold">
                {com.userId?.userName}
              </p>
              <p className="text-gray-300 text-sm">{com.text}</p>
            </div>

            <button>
              <FontAwesomeIcon 
                icon={faHeart} 
                className="text-white text-sm"
              />
            </button>
            {
              com.userId?._id?.toString() === user._id.toString() && (<button onClick={() => { setShowEditComment(true); setEditCommentId(com._id); setEditComment(com.text); setShowComment(false);}}>
              <FontAwesomeIcon 
                icon={faPen} 
                className="text-white text-sm"
              />
            </button>)
            }
            {
               com.userId?._id?.toString() === user._id.toString() && (
                 <button onClick={() => handleDeleteComment(com._id, postId)}>
              <FontAwesomeIcon 
                icon={faTrashCan} 
                className="text-red-500 text-sm"
              />
            </button>
               )
            }

          </div>
        ))}

      </div>

      <div className="border-t border-gray-700 p-3 flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-full outline-none"
        />

        <button 
          onClick={() => handleComment(postId)}
          className="bg-[#EA5415] px-4 py-2 rounded-full text-white font-semibold"
        >
          Post
        </button>
      </div>

    </div>
  </div>
          )}
          

        </div>




        <div>
        {showEditComment && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">


    <div className="bg-gray-900 w-125 max-h-[80vh] rounded-2xl flex flex-col">

      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <h2 className="text-white text-xl font-bold">Edit Comment</h2>
        <FontAwesomeIcon 
          icon={faTimes} 
          className="text-white cursor-pointer"
          onClick={() => setShowEditComment(false)} 
        />
      </div>
      <div className="border-t border-gray-700 p-3 flex gap-2">
        <textarea
          type="text"
          placeholder="Edit a Comment..."
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-2xl h-25 outline-none"
        />

        <button 
          onClick={() => handleEditComment(postId, editCommentId)}
          className="bg-[#EA5415] px-4 py-1 rounded-2xl text-white font-semibold"
        >
          Edit
        </button>
      </div>

    </div>
  </div>
)}
        </div>
        
          </div>
      </>
  )
}

export default Home
