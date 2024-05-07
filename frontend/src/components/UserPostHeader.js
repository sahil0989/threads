import React, { useState } from 'react';
import userPic from "../img/user.jpg"
// import { FaInstagram } from "react-icons/fa";
import { Toaster, toast } from 'sonner';
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { Link } from 'react-router-dom';

function UserPostHeader({ userData, currentUser, handleFollowUnfollow, following }) {

    const [replies, setReplies] = useState(false)
    const [isCopyLinkVisible, setIsCopyLinkVisible] = useState(false);

    const toggleCopyLink = () => {
        setIsCopyLinkVisible(!isCopyLinkVisible);
    };

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL);
        setIsCopyLinkVisible(!isCopyLinkVisible);

        toast.success("Copied Link", { duration: 2000 });
    };

    return (
        <>
            <Toaster richColors position='top-right' />
            <div className='flex justify-between'>
                <div className='flex flex-col'>
                    <h2 className='font-semibold text-2xl'>{userData?.name}</h2>
                    <h6 className='text-sm'>{userData?.username || "markzuckerber"}</h6>
                </div>
                <img src={userData?.profilePic || userPic} className='w-28 h-28 object-cover rounded-full border-2 border-white' alt='avatar' />
            </div>
            <div className='my-2'>{userData?.bio || "Co-founder, executive chairman, and CEO of Meta platforms."}</div>
            <div className='flex justify-between mb-5 items-center'>
                <div className='flex flex-col gap-3'>
                    <h4 className='text-white/55'>{userData?.followers.length} followers</h4>
                    {
                        currentUser?._id === userData?._id ? <Link to="/updateProfile">
                            <button className='bg-[#353535] px-5 py-2 rounded-lg hover:bg-[#252525]'>Update Profile</button>
                        </Link> : following ? <button onClick={handleFollowUnfollow} className='bg-[#353535] px-5 py-2 rounded-lg hover:bg-[#252525]'>Unfollow</button> : <button onClick={handleFollowUnfollow} className='bg-[#353535] px-5 py-2 rounded-lg hover:bg-[#252525]'>Follow</button>
                    }

                </div>
                <div className='flex gap-5 items-center'>
                    {/* <FaInstagram className='cursor-pointer' size="24px" /> */}
                    <div className='relative'>
                        <HiOutlineDotsCircleHorizontal
                            className='cursor-pointer'
                            size="26px"
                            onClick={toggleCopyLink}
                        />
                        {isCopyLinkVisible && (
                            <div className='absolute top-9 rounded-lg left-0 bg-[#424141] hover:bg-[gray-800] p-2'>
                                <button className='w-[6rem] px-2 rounded-md' onClick={copyURL}>Copy Link</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex border-b w-full border-white/15'>
                <h2 onClick={() => setReplies(!replies)} className={`w-full flex justify-center cursor-pointer pb-4 ${replies ? "" : "border-b-2"}`}>Threads</h2>
                <h2 onClick={() => setReplies(!replies)} className={`w-full flex justify-center cursor-pointer pb-4 ${replies ? "border-b-2" : ""}`}>Replies</h2>
            </div>
        </>
    )
}

export default UserPostHeader