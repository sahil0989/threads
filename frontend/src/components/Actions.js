import React, { useState } from 'react'
import { LuSend } from "react-icons/lu";
import { GrSync } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { toast } from 'sonner';

function Actions({ post: post_ }) {

  const currentUser = JSON.parse(localStorage.getItem("user-threads"));

  const [post, setPost] = useState(post_);
  const [liked, setLiked] = useState(post?.likes.includes(currentUser?._id));
  const [liking, setliking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handleLikedFunc = async () => {
    if (!currentUser?._id) return toast.error("You must be logged in to like a post", { duration: 2000 })
    if (liking) return;
    setliking(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/like/${post?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: currentUser?.tokenId })
      })
      const data = await res.json();
      if (data.error) {
        return toast.error(data.error, { duration: 2000 });
      }
      if (!liked) {
        setPost({ ...post, likes: [...post?.likes, currentUser?._id] })
      } else {
        setPost({ ...post, likes: post.likes.filter(id => id !== currentUser?._id) })
      }
      setLiked(!liked);
    } catch (err) {
      return toast.error(err.message, { duration: 2000 });
    } finally {
      setliking(false);
    }
  }
  
  const handleReplyBtn = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/reply/${post?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: currentUser?.tokenId, text: postContent })
      })
      const data = await res.json();
      if (data.error) {
        return toast.error(data.error, { duration: 2000 });
      }
      setPost({ ...post, replies: [...post?.replies, currentUser?._id] })
      console.log(data);
      setShowToast(false);
      return toast.success(data.message, { duration: 2000 });
    } catch (err) {
      return toast.error(err.message, { duration: 2000 });
    }
  }

  const handleInputChange = (e) => {
    const content = e.target.value;
    setPostContent(content);
  };

  return (
    <>
      <div className='flex gap-5 mb-2'>
        {
          liked && <FaHeart onClick={handleLikedFunc} className='cursor-pointer' size={22} />
        }
        {
          !liked && <FaRegHeart className='cursor-pointer' size={22} onClick={handleLikedFunc} />
        }
        <FaRegComment className='cursor-pointer' onClick={() => setShowToast(!showToast)} size={22} />
        <GrSync className='cursor-pointer' size={22} />
        <LuSend className='cursor-pointer' size={22} />
      </div>
      <div className='text-xs text-white/60'>
        {post?.replies.length} replies . {post?.likes.length} likes
      </div>

      {
        showToast && <div
          id="container"
          className="fixed inset-0 bg-black z-30 bg-opacity-30 backdrop-blur-sm flex justify-center pt-20"
        >
          <div className="bg-[#252525] p-4 h-72 rounded w-full md:w-[400px] lg:w-[580px] mx-10">
            <h1 className="font-semibold text-center text-xl text-white">Make a Reply</h1>
            <br />
            <br />
            <div className="w-full">
              <div className="relative w-full min-w-[200px] mb-5">
                <textarea
                  className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-white focus:border-2 focus:border-white focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  value={postContent}
                  onChange={handleInputChange}
                  maxLength="5000"
                ></textarea>
                <label
                  className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-white peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-white peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                >
                  Reply
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 text-center gap-8">
              <button onClick={() => setShowToast(!showToast)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Close
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleReplyBtn()
                }}
                className={`px-5 py-2 hover:bg-[#353535] bg-[#454545] text-white rounded`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Actions