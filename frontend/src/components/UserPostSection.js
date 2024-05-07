// import Actions from './Actions'
// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';

// function UserPostSection({ content, createdAt, isPostImg, likeCount, postImg, profile, replyCount, userName, verify, verifiedTick }) {

//   const [liked, setLiked] = useState(false);

//   const navigate = useNavigate();

//   return (
//     <Link to={"/kritika/post/1"}>
//       <div className='flex w-full border-white/15'>
//         <div className='flex gap-3 mb-4 py-4 w-full px-3'>
//           <div className='flex gap-4 w-full'>

//             <div className='relative flex w-full gap-6'>

//               <div className='absolute border-l h-full ml-6 mt-2 -z-20'></div>

//               {/* profile link  */}
//               <img onClick={(e) => {
//                 e.preventDefault();
//                 navigate(``)
//               }} src={profile} alt='profile' className=' h-12 rounded-full w-12' />

//               <div className='flex w-full flex-col gap-4'>

//                 {/* post uppper bar  */}
//                 <div className='flex justify-between items-start'>



//                   {/* profile name  */}
//                   <div className='flex flex-col'>
//                     <div className='flex gap-2 items-center'>
//                       <h2 className='font-semibold'>{userName}</h2>
//                       {
//                         verify && <img src={verifiedTick} className='h-4 z-10' alt='' />
//                       }

//                     </div>
//                     <p className='text-sm my-2'>{content}</p>
//                   </div>

//                   {/* side bar  */}
//                   <div className='flex gap-4'>
//                     <div className='flex items-center gap-3'>
//                       <p className='text-white/55'>{createdAt}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* post image  */}
//                 {
//                   isPostImg && <img src={postImg} className='w-full h-64 object-cover rounded-lg' alt='post' />
//                 }

//                 {/* action buttons  */}
//                 <Actions liked={liked} setLiked={setLiked} />
//                 <div className='text-xs text-white/60'>{replyCount} replies . {likeCount + (liked ? 1 : 0)} likes</div>
//               </div>

//               {/* other user profile  */}
//               <div className='absolute flex flex-col gap-2 items-center -bottom-3 -mx-2'>
//                 <div className='flex gap-2'>
//                   <img src={profile} className='w-7 h-7 rounded-full' alt='' />
//                   <img src={profile} className='w-7 h-7 rounded-full' alt='' />
//                 </div>
//                 <img src={profile} className='w-7 h-7 rounded-full' alt='' />
//               </div>

//             </div>

//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }

// export default UserPostSection