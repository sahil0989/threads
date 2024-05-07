import axios from 'axios';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const CreatePostForm = (props) => {

    const [imageUrl, setImageUrl] = useState("");
    const [postContent, setPostContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const maxWords = 500;

    const { _id, tokenId } = JSON.parse(localStorage.getItem("user-threads"));

    const handleInputChange = (e) => {
        const content = e.target.value;
        const words = content.trim().split(/\s+/);
        const newWordCount = words.length;
        setPostContent(content);
        setWordCount(newWordCount);
    };

    const handleCreatePost = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ postedby: _id, text: postContent, img: imageUrl, tokenId })
            })
            const data = await res.json();
            if (data.error) {
                return toast.error(data.error, { duration: 2000 });
            }
            props.setShowToast(false);
            window.location.reload();
            return toast.success(data.message, { duration: 2000 });
        } catch (err) {
            return toast.error(err.message, { duration: 2000 });
        }
    };

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'bmdixbcr');

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
        }
    };


    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="bg-[#252525] p-4 rounded w-full md:w-[400px] lg:w-[580px] mx-10">
            <h1 className="font-semibold text-center text-xl text-white">Create a Post</h1>
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
                        Message
                    </label>
                    {wordCount > maxWords && (
                        <div className="text-red-500 text-xs mt-1">You have exceeded the word limit (500 words).</div>
                    )}
                </div>

                {
                    !imageUrl && <div className='mb-4 w-full'>
                        <div {...getRootProps()} className='border-white/60 border-2 border-dotted bg-[#353535] rounded-lg' style={{ padding: '20px', marginBottom: '20px' }}>
                            <input {...getInputProps()} />
                            <p>Drag and drop an image here, or click to select an image</p>
                        </div>
                    </div>
                }
                {
                    imageUrl && <img src={imageUrl} className='w-full h-64 rounded-lg object-cover mb-8' alt='post' />
                }

            </div>
            <div className="grid grid-cols-2 text-center gap-8">
                <button
                    onClick={() => props.setShowToast(false)}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                    Close
                </button>
                <button
                    className={`px-5 py-2 hover:bg-[#353535] bg-[#454545] text-white rounded ${wordCount > maxWords ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    onClick={handleCreatePost}
                    disabled={wordCount === 0 || wordCount > maxWords}
                >
                    Create Post
                </button>
            </div>
        </div>
    );
};

export default CreatePostForm;
