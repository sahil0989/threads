import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import Post from '../components/Post';

function HomePage() {

  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user-threads"));

    if (!user) {
      navigate("/auth")
    }
    const getFeedPosts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/feed`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tokenId: user?.tokenId  })
        })
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        return toast.error(err.message, { duration: 2000 });
      }
    }
    getFeedPosts();
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {
        posts.length === 0 && <div>Follow some Users to see feed</div>
      }
      {
        posts.map((post) => {
          return <Post key={post._id} post={post} postedby={post.postedby} />
        })
      }
    </>
  )
}

export default HomePage