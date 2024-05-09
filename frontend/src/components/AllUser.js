import React, { useState } from 'react'
import { FaUsers } from "react-icons/fa";
import { toast } from 'sonner';
import UserCard from './UserCard';

function AllUser() {

    const [users, setUsers] = useState([]);
    const [showToast, setShowToast] = useState(false);

    useState(() => {
        const currentUser = JSON.parse(localStorage.getItem("user-threads"));
        if (!currentUser) return;
        const getAllUser = async (tokenId) => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/allUsers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ tokenId })
                })
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                return toast.error(err.message, { duration: 2000 });
            }
        }
        getAllUser(currentUser?.tokenId);
    }, [])

    return (
        <>
            <div className='fixed z-10 bottom-10 left-8 bg-[#353535] px-5 py-3 rounded-lg hover:bg-[#252525] cursor-pointer'>
                <FaUsers onClick={() => setShowToast(true)} />
            </div>
            {
                showToast && <div
                    id="container"
                    className="fixed inset-0 bg-black z-30 bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
                >
                    <div class="relative flex flex-col h-[80vh] overflow-y-scroll text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
                        <nav class="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                            <button onClick={() => setShowToast(!showToast)} className='absolute right-5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg'>Close</button>
                            <h2 className='pl-5 text-2xl font-bold mb-5'>Our Users</h2>

                            {
                                users?.length === 0 ? (<div>We don't have any user right now !!</div>) : (

                                    users.map((user) => {
                                        return <UserCard user={user} showToast={showToast} setShowToast={setShowToast} />
                                    })

                                )
                            }
                        </nav>
                    </div>
                </div>
            }
        </>
    )
}

export default AllUser