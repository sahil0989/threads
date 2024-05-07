import Actions from './Actions'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict';
import { MdDeleteOutline } from "react-icons/md";
import userPic from "../img/user.jpg"

function Post({ post, postedby, currentUser }) {

    const [userData, setUserData] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${postedby}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                const data = await res.json();
                if (data.error) {
                    return toast.error(data.error, { duration: 2000 });
                }
                setUserData(data.user)
            } catch (err) {
                return toast.error(err.message, { duration: 2000 });
            }
        }
        fetchUserData();
        // eslint-disable-next-line
    }, [])

    const handleDeleteBtn = async (e) => {
        try {
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            console.log(currentUser?.tokenId)
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/delete/${post._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ tokenId: currentUser?.tokenId })
            });
            const data = await res.json();

            if (data.error) return toast.error(data.error, { duration: 2000 });
            window.location.reload();
            return toast.success("Post Deleted Successfully!!", { duration: 2000 });

        } catch (err) {
            console.error(err);
            toast.error(err.message || "An error occurred", { duration: 2000 });
        }
    };


    return (
        <Link to={`${userData?.username}/post/${post?._id}`}>
            <div className='flex w-full border-white/15 cursor-default'>
                <div className='flex gap-3 mb-4 py-4 w-full px-3'>
                    <div className='flex gap-4 w-full'>

                        <div className='relative flex w-full gap-6'>

                            <div className='absolute border-l h-full ml-6 mt-2 -z-20'></div>

                            {/* profile link  */}
                            <img onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${userData?.username}`)
                            }} src={userData?.profilePic || userPic} alt='profile' className='h-12 cursor-pointer rounded-full w-12' />

                            <div className='flex w-full flex-col gap-4'>

                                {/* post uppper bar  */}
                                <div className='flex justify-between items-start'>

                                    {/* profile name  */}
                                    <div className='flex flex-col'>
                                        <div onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/${userData?.username}`)
                                        }} className='flex gap-2 cursor-pointer items-center'>
                                            <h2 className='font-semibold'>{userData?.username}</h2>
                                        </div>
                                        <p className='text-sm my-2'>{post?.text}</p>
                                    </div>

                                    {/* side bar  */}
                                    <div className='flex gap-4'>
                                        <div className='flex items-center gap-3 text-xs'>
                                            <p className='text-white/55'>{formatDistanceToNowStrict(new Date(post?.createdAt))} ago</p>
                                        </div>
                                        {
                                            userData?._id === currentUser?._id && <button className='p-2' onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteBtn();
                                            }}><MdDeleteOutline size={22} /></button>
                                        }
                                    </div>

                                </div>

                                {/* post image  */}
                                {
                                    post?.img && <img src={post?.img} className='w-full h-64 object-cover rounded-lg' alt='post' />
                                }

                                {/* action buttons  */}
                                <div onClick={(e) => {
                                    e.preventDefault();
                                }}>
                                    <Actions post={post} />
                                </div>
                            </div>

                            {/* other user profile  */}
                            <div className='absolute flex flex-col bg-[#171717] gap-2 items-center -bottom-3 -mx-2'>
                                {
                                    post?.replies.length === 0 && <div className='w-16 h-7 flex justify-center'>
                                        <h3 className='scale-125'>&#129393;</h3>
                                    </div>
                                }
                                <div className='flex pl-2 gap-2 bg-[#171717] w-16'>
                                    {
                                        post?.replies[0] && <img src={post?.replies[0].userProfilePic || userPic} className='w-5 h-5 rounded-full' alt='' />
                                    }
                                    {
                                        post?.replies[1] && <img src={post?.replies[1].userProfilePic || userPic} className='w-5 h-5 rounded-full' alt='' />
                                    }
                                </div>
                                {
                                    post?.replies[2] && <img src={post?.replies[2].userProfilePic || userPic} className='w-7 h-7 rounded-full' alt='' />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Post