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
  const [stories, setStories] = useState([]);
const [showStory, setShowStory] = useState(false);
const [currentStories, setCurrentStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddStory, setShowAddStory] = useState(false);
  const [showMediaAddStory, setShowMediaAddStory] = useState(false);
  const [showTextAddStory, setShowTextAddStory] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLikedby, setShowLikedby] = useState(false);
  const [likedBy, setLikedBy] = useState([]);

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

  useEffect(() => {
  const fetchStories = async () => {
    try {
      const res = await instance.get("/story");
      setStories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchStories();
  }, [user]);
  
  const groupedStories = {};

stories.forEach((story) => {
  if (!groupedStories[story.userId._id]) {
    groupedStories[story.userId._id] = [];
  }
  groupedStories[story.userId._id].push(story);
});
  
  useEffect(() => {
  if (!showStory) return;

  const timer = setTimeout(() => {
    if (currentIndex < currentStories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowStory(false);
    }
  }, 15000);

  return () => clearTimeout(timer);
  }, [currentIndex, showStory]);
  
  
  
  const handleAddMediaStory = async (file) => {
  try {
    const formData = new FormData();
formData.append("storyMedia", file);

    const uploadRes = await instance.post("/story/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const storyRes = await instance.post("/story", {
      userId: user._id,
      media: uploadRes.data.url,
      mediaType: file.type.startsWith("video") ? "video" : "image"
    });

 
    setStories((prev) => [
      ...prev,
      {
        ...storyRes.data,
        userId: user // 👈 THIS IS CRITICAL
      }
    ]);

    setShowMediaAddStory(false);
    toast.success("Story added 🔥");

  } catch (err) {
    console.log(err);
    toast.error("Upload failed");
  }
  };
  
  const handleAddTextStory = async () => {
  try {
    const storyRes = await instance.post("/story", {
      userId: user._id,
      text: storyText, 
      mediaType: "text"
    });

    setStories((prev) => [
      ...prev,
      {
        ...storyRes.data,
        userId: user
      }
    ]);

    setShowTextAddStory(false);
    setEditComment("");
    toast.success("Text story added 🔥");

  } catch (err) {
    console.log(err);
    toast.error("Failed");
  }
};



  const handleFetchLikedBy = async (id) => {
    try {
      const res = await instance.get(`/create-post/getLikedusers/${id}`);
      setLikedBy(res.data.likedUsers);
    }
    catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  }
  
 const handleCommentLike = async (postId, commentId) => {
  try {
    await instance.post(`/create-post/comment-like/${postId}/${commentId}`);

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comment: post.comment?.map((c) => {
              if (c._id === commentId) {
                const alreadyLiked = c.likes?.includes(user._id) || false;
                return {
                  ...c,
                  likes: alreadyLiked
                    ? c.likes.filter((id) => id !== user._id)
                    : [...(c.likes || []), user._id],
                };
              }
              return c;
            }) || [],
          };
        }
        return post;
      })
    );

    // Update the comment modal if open
    setComment((prevComments) =>
      prevComments.map((c) => {
        if (c._id === commentId) {
          const alreadyLiked = c.likes?.includes(user._id) || false;
          return {
            ...c,
            likes: alreadyLiked
              ? c.likes.filter((id) => id !== user._id)
              : [...(c.likes || []), user._id],
          };
        }
        return c;
      })
    );

  } catch (err) {
    console.log(err);
  }
};


  return (
      <>
          <h1 className="text-white font-bold text-xl lg:text-3xl mt-5">Stories</h1>
         <div className="flex gap-2 lg:gap-5 overflow-x-auto">

  {/* ADD STORY BUTTON */}
  <div className="flex flex-col items-center cursor-pointer my-4 lg:ml-10 justify-center">
    <label onClick={() => setShowAddStory(true)} className="h-12 w-12 rounded-full bg-[#EA5415] flex items-center justify-center text-white text-2xl cursor-pointer">
      +
    </label>
    <p className="text-white text-xs mt-1">Your Story</p>
        </div>
        
  {/* ADD STORY FORM */}
  {showAddStory && (
    <div className="fixed inset-0 bg-blur flex justify-center items-center z-50">
      <div className="relative w-100 h-120 bg-gray-900 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowAddStory(false)}
          className="absolute top-3 right-3 text-white text-xl z-10"
        >
          ✕
              </button>
              <div className="flex flex-col justify-center items-center">
                <div className="flex-1">
                <button onClick={() => { setShowAddStory(false); setShowMediaAddStory(true); }} className="text-white border border-gray-600 px-2 mt-15 py-20 rounded-2xl">Click Here to Add Media to story! (Photo and Video)</button>
              </div>
                <div className="flex-1">
                  <button onClick={() => { setShowAddStory(false); setShowTextAddStory(true);  }} className="text-white border border-gray-600 px-2 mt-5 py-20 rounded-2xl">Click Here to Add Text to story!</button>
              </div>
              </div>
      </div>
    </div>
        )}
        
        {
          showMediaAddStory && (
            <div className="fixed inset-0 bg-blur flex justify-center items-center z-50">
              <div className="relative w-100 h-120 bg-gray-900 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowMediaAddStory(false)}
                  className="absolute top-3 right-3 text-white text-xl z-10"
                >
                  ✕
                </button>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex-1 flex flex-col justify-center items-center mt-25">
                    <input type="file"
  onChange={(e) => setSelectedFile(e.target.files[0])} className="text-white" />
                    <button onClick={() => handleAddMediaStory(selectedFile)} className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent py-2 text-xl border border-amber-600 px-2 rounded-lg mt-15">
                      Add to Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {
          showTextAddStory && (
            <div className="fixed inset-0 bg-blur flex justify-center items-center z-50">
              <div className="relative w-100 h-120 bg-gray-900 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowTextAddStory(false)}
                  className="absolute top-3 right-3 text-white text-xl z-10"
                >
                  ✕
                </button>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex-1 flex flex-col justify-center items-center mt-25">
                    <textarea type="text" value={storyText}
  onChange={(e) => setStoryText(e.target.value)} className="text-white border border-gray-600 h-25 w-75 rounded-2xl text-center" placeholder="Whats On your Mind?"/>
                    <button className="bg-linear-to-r from-[#F68D17] to-[#EA5415] bg-clip-text text-transparent py-2 text-xl border border-amber-600 px-2 rounded-lg mt-15" onClick={handleAddTextStory}>
                      Add to Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

  {/* EXISTING STORIES */}
  {Object.values(groupedStories).length > 0 ? (
    Object.values(groupedStories).map((userStories, i) => (
      <div
  key={i}
  onClick={() => {
    setCurrentStories(userStories);
    setCurrentIndex(0);
    setShowStory(true);
  }}
  className="mt-2 lg:ml-2 flex flex-col w-17.5 shrink-0 text-center justify-center items-center cursor-pointer"
>
  <img
    src={userStories[0]?.userId?.profilePic || userimage}
    className="h-15 w-15 rounded-full border-2 border-pink-500 object-cover"
  />

  <p className="text-white text-center text-xs truncate w-full">
    {userStories[0]?.userId?.userName}
  </p>
</div>
    ))
  ) : (
    <p className="text-white">No stories</p>
  )}

</div>
      {showStory && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">

    <div className="relative w-100 h-150 bg-black border border-gray-600 rounded-xl overflow-hidden">

      {/* Close */}
      <button
        onClick={() => setShowStory(false)}
        className="absolute top-3 right-3 text-white text-xl z-10"
      >
        ✕
      </button>

      {currentStories[currentIndex]?.mediaType === "image" && (
  <img
    src={currentStories[currentIndex]?.media}
    className="w-full h-full object-cover"
  />
)}

{currentStories[currentIndex]?.mediaType === "video" && (
  <video
    src={currentStories[currentIndex]?.media}
    autoPlay
    className="w-full h-full object-cover"
  />
)}

{currentStories[currentIndex]?.mediaType === "text" && (
  <div className="flex items-center justify-center h-full text-white text-xl text-center px-5">
    {currentStories[currentIndex]?.text}
  </div>
)}

    </div>
  </div>
)}
          <div>
              <h2 className="text-white font-bold text-xl lg:text-3xl">Posts</h2>
          </div>
      <div className="flex flex-row lg:gap-5 gap-2">
        <div className="lg:flex-1">
              {
                  posts.map((post) => (
  <div key={post._id} className="lg:mt-15 mt-5 lg:ml-20 ml-5">
    <div className="flex items-center gap-3">
      <img 
        src={post.userId?.profilePic || userimage} 
        className="lg:h-12 lg:w-12 h-8 w-8 rounded-full border-2 border-[#EA5415]"
      />

      <h3 className="text-white font-semibold">
        {post.userId?.userName}
      </h3>
    </div>
                          <div className="bg-gray-900 max-w-xl flex flex-col justify-center items-center rounded-3xl mt-3">
                              {post.text && (
      <p className="text-white font-semibold text-[13px] lg:text-[18px] mt-2 pt-4 text-center">
        {post.text}
      </p>
    )}
    {post.image && (
      <img 
        src={post.image} 
        className="lg:h-80 lg:w-80 w-40 h-40 rounded-md mt-2"
      />
    )}
    {post.video && (
      <video 
        src={post.video} 
        controls 
        className="lg:h-100 lg:w-150 h-70 w-90 rounded-md mt-2"
      />
                              )}
                              <div className="my-5">
                                  <button onClick={() => handleLikes(post._id)} className="cursor-pointer"><FontAwesomeIcon 
  icon={post.likes.includes(user._id) ? faHeartSolid : faHeart} 
  className={post.likes.includes(user._id) ? "text-red-500 lg:text-2xl text-md" : "text-white lg:text-2xl text-md"} 
/><span className="text-[#EA5415] lg:text-2xl text-md ml-1 mr-4">{post.likes.length }</span></button>
                          <button onClick={() => { setShowComment(true); setPostId(post._id); handleFetchComments(post._id); }} className="cursor-pointer"><FontAwesomeIcon icon={faComment} className="text-white lg:text-2xl text-md" /><span className="text-[#EA5415] lg:text-2xl text-md ml-1 mr-4">{post.comment?.length || 0}</span></button>
                          <span className="text-gray-500 underline cursor-pointer ml-5" onClick={() => { setShowLikedby(true); handleFetchLikedBy(post._id);}}>Liked By?</span>
                        </div>
                        
                              </div>

  </div>
))
        }
        </div>
        
        {
          showLikedby && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
              <div className="bg-gray-900 w-125 max-h-[80vh] rounded-2xl flex flex-col">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                  <h2 className="text-white text-xl font-bold">Liked By</h2>
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    className="text-white cursor-pointer"
                    onClick={() => setShowLikedby(false)} 
                  />
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                  {likedBy.map((user) => (
                    <div key={user._id} className="flex items-center gap-3">
                      <img 
                        src={user.profilePic || userimage} 
                        className="h-12 w-12 rounded-full border-2 border-[#EA5415]"
                      />
                      <h3 className="text-white font-semibold">{user.userName}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }



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

       
              <button onClick={() => handleCommentLike(postId, com._id)}>
  <FontAwesomeIcon 
    icon={com.likes?.includes(user._id) ? faHeartSolid : faHeart}
    className={
      com.likes?.includes(user._id)
        ? "text-red-500 text-sm"
        : "text-white text-sm"
    }
  /><span className="text-xs text-gray-400 ml-1">
  {com.likes?.length || 0}
</span>
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
