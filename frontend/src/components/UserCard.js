import React from 'react'
import { useNavigate } from 'react-router-dom'

function UserCard({ user, showToast, setShowToast }) {
    
    const navigate = useNavigate();

    const handleFunc = () => {
        setShowToast(!showToast);
        navigate(`/${user?.username}`)
        window.location.reload();
    }

    return (
        <>
            <div onClick={handleFunc}>
                <div role="button"
                    class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                    <div class="grid mr-4 place-items-center">
                        <img alt="candice" src={user?.profilePic}
                            class="relative inline-block h-12 w-12 !rounded-full  object-cover object-center" />
                    </div>
                    <div>
                        <h6
                            class="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                            {user?.username}
                        </h6>
                        <p class="block font-sans text-sm antialiased font-normal leading-normal text-gray-700">
                            {user?.bio}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCard