import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function LoginPage({ loginPageVisible, setLoginPage }) {

  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState({
    username: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputVal(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSubmitFunc = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputVal)
      });
      const data = await res.json();
      if (data.error) {
        return toast.error(data.error, { duration: 2000 })
      }
      toast.success("Login Successfully!!")
      const storeData = {
        _id: data._id,
        username: data.username,
        tokenId: data.tokenId
      }
      localStorage.setItem("user-threads", JSON.stringify(storeData));
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <Toaster richColors position="top-right" />
      <h1 className='text-3xl font-bold w-full text-center my-6'>Login</h1>
      <form onSubmit={handleSubmitFunc} className='flex flex-col gap-8 w-full bg-[#252525] py-8 rounded-lg px-8 lg:px-20'>

        <div className='flex flex-col w-full'>
          <label className='mb-2 text-sm'>Username</label>
          <input type='text' name='username' className='py-2 px-3 rounded-lg bg-transparent border-2 border-white/50' onChange={handleChange} value={inputVal.username} required />
        </div>

        <div className='flex flex-col w-full'>
          <label className='mb-2 text-sm'>Password</label>
          <input type='password' name='password' className='py-2 px-3 rounded-lg bg-transparent border-2 border-white/50' onChange={handleChange} value={inputVal.password} required />
        </div>

        <div className='flex items-center flex-col w-full'>
          <p className='my-2 pb-2 text-sm'>If you don't have an Account ? <span className='text-blue-500 cursor-pointer text-[18px] font-semibold' onClick={() => setLoginPage(!loginPageVisible)}>Sign Up</span></p>
          <button type='submit' className='bg-blue-700 px-8 py-2 rounded-lg hover:bg-blue-800 font-semibold'>Login</button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
