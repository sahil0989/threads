import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { toast } from 'sonner';
import CreatePostForm from '../components/CreatePostForm';

function CreatePost() {

    const [showToast, setShowToast] = useState(false);

    const handleButton = (e) => {
        setShowToast(!showToast);
        return toast.success("Click on Post", { duration: 2000 })
    }


    return (
        <>
            <div onClick={handleButton} className='fixed z-10 bottom-10 cursor-pointer right-10 bg-[#353535] px-5 py-2 rounded-lg hover:bg-[#252525]'>
                <div className='flex gap-3 items-center'>
                    <FaPlus />
                    <h3>Post</h3>
                </div>
            </div>
            {
                showToast && <div
                    id="container"
                    className="fixed inset-0 bg-black z-30 bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
                >
                    <CreatePostForm setShowToast={setShowToast} showToast={showToast}/>
                </div>
            }
        </>
    )
}

export default CreatePost