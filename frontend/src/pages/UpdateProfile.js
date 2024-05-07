import { Toaster, toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userPic from "../img/user.jpg"

const UserProfileForm = () => {

    const [imgUrl, setImageUrl] = useState("")
    const [uploading, setUploading] = useState(false)
    const [idT, setIdT] = useState("");

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: '',
        bio: '',
        password: '',
    });


    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user-threads"));
        if (!user) {
            navigate("/auth")
        } else {
            setIdT(user.tokenId);
            fetchUser(user.username);
        }
        // eslint-disable-next-line
    }, []);

    const fetchUser = async (username) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(),
            })
            const data = await response.json();
            setUserData(data.user);
        } catch (error) {
            return toast.error(error.message, { duration: 2000 })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'bmdixbcr');
        if (uploading) {
            return toast.warning("File Uploading Plz. Wait !!", { duration: 2000 });
        }
        setUploading(true)
        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dlhlrsdow/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.secure_url);
            return toast.success("Image Uploaded Successfully!!", { duration: 2000 })
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/updateProfile/${userData._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...userData, profilePic: imgUrl, tokenId: idT }),
            })
            const data = await res.json();
            if (data.error) {
                return toast.error(data.error, { duration: 2000 });
            }
            const updatedData = {
                _id: data.user._id,
                tokenId: idT,
                username: data.user.username,
            }
            localStorage.setItem("user-threads", JSON.stringify(updatedData));
            navigate("/");
            return toast.success("Profile Updated!!", { duration: 2000 });

        } catch (err) {
            console.log(err.message)
            return toast.error(err.message, { duration: 2000 });
        }
    }

    const handleCancelBtn = () => {
        navigate("/")
    }
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="max-w-lg mx-auto">
            <Toaster richColors position="top-right" />
            <h1 className='text-3xl font-bold text-center my-6'>User Profile Edit</h1>
            <form onSubmit={handleSubmit} className='bg-[#252525] text-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <div className='flex gap-10'>
                    <div className='mb-4 w-36'>
                        <img src={imgUrl || userData.profilePic || userPic} alt="Profile" className='rounded-full border-2 border-white/55 w-24 h-24 mx-auto' />
                    </div>
                    <div className='mb-4 w-full'>
                        <div {...getRootProps()} className='border-white/60 border-2 border-dotted bg-[#353535] rounded-lg' style={{ padding: '20px', marginBottom: '20px' }}>
                            <input {...getInputProps()} />
                            <p>Drag and drop an image here, or click to select an image</p>
                        </div>
                    </div>
                </div>
                <div className='mb-4'>
                    <label htmlFor="fullName" className='block text-sm font-bold mb-2'>Full Name</label>
                    <input type="text" id="fullName" name="name" value={userData.name} onChange={handleChange} className='bg-transparent border-white/55 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="email" className='block text-sm font-bold mb-2'>Email Address</label>
                    <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} className='bg-transparent border-white/55 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="username" className='block text-sm font-bold mb-2'>Username</label>
                    <input type="text" id="username" name="username" value={userData.username} onChange={handleChange} className='bg-transparent border-white/55 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="bio" className='block text-sm font-bold mb-2'>Bio</label>
                    <textarea id="bio" name="bio" value={userData.bio} onChange={handleChange} className='bg-transparent border-white/55 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline' />
                </div>

                <div className='flex items-center w-full gap-14 justify-between'>
                    <button type='button' className='bg-[#555555] w-full hover:bg-[#353535] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={handleCancelBtn}>Cancel</button>
                    <button type='submit' className='bg-[#1e6e29] w-full hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Update</button>
                </div>
            </form>
        </div>
    );
};

export default UserProfileForm;
