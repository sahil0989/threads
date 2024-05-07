import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import Navbar from './components/Navbar';
import AuthPage from './pages/Auth/AuthPage';
import UserProfileForm from './pages/UpdateProfile';
import CreatePost from './pages/CreatePost';
import LogoutBtn from './components/LogoutBtn';
import UserProfile from './pages/UserProfile';
import AuthNavbar from './pages/Auth/AuthNavbar';
import AllUser from './components/AllUser';

function App() {

  return (
    <div className='max-w-[620px] mx-auto px-8'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <>
              <Navbar />
              <CreatePost />
              <LogoutBtn />
              <HomePage />
              <AllUser />
            </>
          } />
          <Route path='/auth' element={
            <>
              <AuthNavbar />
              <AuthPage />
            </>
          } />

          <Route path='/updateProfile' element={
            <>
              <Navbar />
              <CreatePost />
              <LogoutBtn />
              <UserProfileForm />
              <AllUser />
            </>
          } />
          <Route path='/:username' element={
            <>
              <Navbar />
              <CreatePost />
              <LogoutBtn />
              <UserProfile />
              <AllUser />
            </>
          } />
          <Route path='/:username/post/:pid' element={
            <>
              <Navbar />
              <CreatePost />
              <LogoutBtn />
              <PostPage />
              <AllUser />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
