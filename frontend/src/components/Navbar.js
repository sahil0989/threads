import React from 'react';
import logo from '../img/light-logo.svg';
import { FaRegCircleUser } from "react-icons/fa6";
import { LuHome } from "react-icons/lu";
import { Link } from 'react-router-dom';

function Navbar() {

  const currentUser = JSON.parse(localStorage.getItem("user-threads"));

  return (
    <>
      <div className='flex justify-between px-6 items-center mt-6 mb-12'>
        <Link to="/">
          <LuHome size={28} />
        </Link>
        <img src={logo} className='w-10 cursor-pointer' alt='logo' />
        <Link to={`/${currentUser?._id}`}>
          <FaRegCircleUser size={28} />
        </Link>
      </div>
    </>
  )
}

export default Navbar;
