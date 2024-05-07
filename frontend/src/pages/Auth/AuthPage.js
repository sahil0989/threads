import React, { useEffect, useState } from 'react'
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
    const [loginPageVisible, setLoginPage] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user-threads"));
        if (user) {
            navigate("/")
        }
    }, [navigate])

    return (
        <>
            {
                loginPageVisible && <LoginPage setLoginPage={setLoginPage} loginPageVisible={loginPageVisible} />
            }
            {
                !loginPageVisible && <SignUpPage setLoginPage={setLoginPage} loginPageVisible={loginPageVisible} />
            }
        </>
    )
}

export default AuthPage