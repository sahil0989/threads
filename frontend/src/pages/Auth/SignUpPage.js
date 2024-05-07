import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function SignUpPage({ loginPageVisible, setLoginPage }) {

  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputVal(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSubmitFunc = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputVal)
      });
      const data = await res.json();

      console.log(data.error)

      if (data.error) {
        return toast.error(data.error, { duration: 2000 })
      }
      console.log("Data: ",data)

      const storeData = {
        tokenId: data.tokenId,
        username: data.username,
        _id: data._id
      }
      localStorage.setItem("user-threads", JSON.stringify(storeData));
      navigate("/");
      return toast.success("Login Successfully!!", { duration: 2000 });
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <Toaster richColors position="top-right" />
      <h1 className='text-3xl font-bold w-full text-center my-6'>Sign Up</h1>

      <form onSubmit={handleSubmitFunc} className='flex flex-col gap-8 w-full bg-[#252525] py-8 rounded-lg px-8 mb-24'>
        <div className='flex flex-col sm:flex-row gap-6'>
          <div className='flex flex-col w-full'>
            <label className='mb-2 text-sm'>Full Name</label>
            <input type='text' name='name' className='py-2 px-3 rounded-lg bg-transparent border-2 border-white/50' onChange={handleChange} value={inputVal.name} required />
          </div>

          <div className='flex flex-col w-full'>
            <label className='mb-2 text-sm'>Username</label>
            <input type='text' name='username' className='py-2 px-3 rounded-lg bg-transparent border-2 border-white/50' onChange={handleChange} value={inputVal.username} required />
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <label className='mb-2 text-sm'>Email Id</label>
          <input type='email' name='email' className='py-2 px-3 rounded-lg bg-transparent border-2 border-white/50' onChange={handleChange} value={inputVal.email} required />
        </div>

        <div className='flex flex-col w-full'>
          <label className='mb-2 text-sm'>Password</label>
          <input type='password' name='password' className='py-2 px-3 rounded-lg bg-transparent border-2 border-white/50' onChange={handleChange} value={inputVal.password} required />
        </div>

        <div className='flex items-center flex-col w-full'>
          <p className='my-2 pb-2 text-sm'>Already have an Account ? <span className='text-blue-500 cursor-pointer text-[18px] font-semibold' onClick={() => setLoginPage(!loginPageVisible)}>Login</span></p>
          <button type='submit' className='bg-blue-700 px-8 py-2 rounded-lg hover:bg-blue-800 font-semibold'>Sign Up</button>
        </div>
      </form>

    </div>
  )
}

export default SignUpPage
