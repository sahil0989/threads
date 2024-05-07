import React from 'react'
import logo from '../../img/light-logo.svg';

function AuthNavbar() {
    return (
        <div className='flex justify-center px-6 items-center mt-6 mb-12'>
            <img src={logo} className='w-10 cursor-pointer' alt='logo' />
        </div>
    )
}

export default AuthNavbar