import React from 'react'
import { Toaster, toast } from 'sonner';
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            if (data.error) {
                return toast.error(data.error, { duration: 2000 });
            }
            toast.success("Logout Successfully!!", { duration: 2000 });
            localStorage.removeItem("user-threads");
            navigate("/auth")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Toaster richColors position="top-right" />
            <button onClick={handleLogout} className='fixed z-10 top-8 right-12 bg-[#353535] px-3 py-2 rounded-lg hover:bg-[#252525] font-semibold'>
                <FiLogOut />
            </button>
        </>
    )
}

export default LogoutBtn