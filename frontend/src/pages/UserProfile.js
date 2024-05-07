import React, { useEffect, useState } from 'react';
import UserPostHeader from '../components/UserPostHeader';
import LogoutBtn from '../components/LogoutBtn';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';

function UserProfile() {

    const [userData, setUserData] = useState(null);
    const [following, setFollowing] = useState(false)
    const [posts, setPosts] = useState([]);
    const { username } = useParams();

    const currentUser = JSON.parse(localStorage.getItem("user-threads"));

    useEffect(() => {
        getUser();
        getUserPost();
        // eslint-disable-next-line
    }, [])

    const getUserPost = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/user/${currentUser?.username}`)
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            return toast.error(err.message, { duration: 2000 });
        }
    }

    const getUser = async () => {
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
            setFollowing(data.user.followers.includes(currentUser?._id));
        } catch (err) {
            return toast.error(err.message, { duration: 2000 });
        }
    }

    const handleFollowUnfollow = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/follow/${userData?._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tokenId: currentUser?.tokenId }),
            })
            const data = await res.json();
            if (data.error) {
                return toast.error(data.error, { duration: 2000 });
            }
            setFollowing(!following);
            getUser();
            return toast.success(data.message + " :- " + currentUser?.username, { duration: 2000 });
        } catch (err) {
            return toast.error(err.message, { duration: 2000 });
        }
    }

    return (
        <div>
            <LogoutBtn />
            <UserPostHeader currentUser={currentUser} userData={userData} handleFollowUnfollow={handleFollowUnfollow} following={following} />
            {
                posts.length === 0 ? <div>No Post available</div> : (
                    posts.map((post) => {
                        return <Post key={post._id} post={post} postedby={post.postedby} currentUser={currentUser} />
                    })
                )
            }

        </div>
    )
}

export default UserProfile