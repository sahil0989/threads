import Actions from './Actions'
import React, { useState } from 'react'
import userPic from "../img/user.jpg"

function Comments({ comment, createdAt, likeCount, userName, userAvatar }) {
    const [liked, setLiked] = useState(false);

    return (
        <>
            <div className='flex gap-5 w-full'>
                <img src={userAvatar || userPic} alt='' className='w-10 h-10 rounded-full' />
                <div className='flex w-full justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='font-semibold'>{userName}</h2>
                        <p className='text-sm'>{comment}</p>
                        <div className='scale-75 -ml-5'>
                            <Actions liked={liked} setLiked={setLiked} />
                        </div>
                    </div>
                </div>
            </div>
            <hr className='border-white/30 my-3' />
        </>
    )
}

export default Comments