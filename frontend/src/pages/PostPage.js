import React, { useEffect, useState } from 'react'
import Comments from '../components/Comments';
import LogoutBtn from '../components/LogoutBtn';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import userPic from "../img/user.jpg"

function PostPage() {

  const { username, pid } = useParams();

  const [userDetails, setUserDetails] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postData, setPostData] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user-threads"))

  useEffect(() => {
    getPostDetails();
    getUserDetails();
    // eslint-disable-next-line
  }, [])

  const getPostDetails = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${pid}`, {
        method: 'GET'
      })

      const data = await res.json();

      setPostData(data.post);
    } catch (err) {
      return toast.error(err.message, { duration: 2000 });
    }
  }

  const getUserDetails = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify()
      })

      const data = await res.json();
      if (data.error) {
        return toast.error(data.error, { duration: 2000 });
      }
      setUserDetails(data.user);
    } catch (err) {
      return toast.error(err.message, { duration: 2000 });
    }
  }

  const handleReplyBtn = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/reply/${pid}`, {
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
      window.location.reload();
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
      <LogoutBtn />
      {/* post header  */}
      <div className='flex items-center gap-5 w-full'>
        <img src={userDetails?.profilePic || userPic} alt='' className='w-12 h-12 rounded-full object-cover' />

        <div className='flex w-full justify-between'>
          <div className='flex gap-2 items-center'>
            <h2 className='text-xl font-semibold'>{userDetails?.username}</h2>
          </div>
          <div className='flex items-center gap-3'>
            <h2 className='text-white/50'>2d</h2>
          </div>
        </div>


      </div>

      {/* post content  */}
      <div className='flex flex-col gap-5 py-3'>
        <p>{postData?.text}</p>
        {
          postData?.img && <img src={postData?.img} className='w-full h-64 object-cover rounded-lg' alt='post' />
        }

        {/* <div onClick={(e) => {
          e.preventDefault();
        }}>
          <ActionPage post={postData} />
        </div> */}

        <hr className='border-white/30' />

        <div className='flex w-full justify-between'>
          <h2 className='text-white/55'> <span className='text-2xl text-white'>👋</span> Get the app to like, reply and post.</h2>
          <button onClick={() => setShowToast(!showToast)} className='font-semibold text-xl rounded-lg px-5 py-2 bg-[#252525]'>Get</button>
        </div>
        <hr className='border-white/30' />
      </div>
      {
        postData?.replies.length === 0 ? (
          <div>No Replies</div>
        ) : (
          postData?.replies.map((reply) => {
            return <Comments key={reply?._id} comment={reply.text} createdAt="1d" userName={reply.username} userAvatar={reply.userProfilePic} />
          })
        )
      }

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

export default PostPage