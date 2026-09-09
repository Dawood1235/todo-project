// import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";import { useEffect } from "react";
import NotificationBell from "./pages/notificationBell";
import { useState,useContext } from "react";
import Profile from "./pages/profile"
import { FaUserCircle } from "react-icons/fa";
import { Search } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./ContextProvider";



export default function Navbar({ search, setSearch, setCurrentPage, profilePic }) {
      const { user, role, loading } = useContext(UserContext);

      console.log("CONTEXT USER:", user);
    console.log("CONTEXT ROLE:", role);
    console.log("CONTEXT LOADING:", loading);



  const showSearchOn = "/";
  const [showProfile, setShowProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/api/profile",
          {
            headers:
            {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = response.data;

        console.log("PROFILE DATA FROM BACKEND:", data);

        setProfileImage(response.data.profilePic || "");
      } catch (error) {
        console.log("Error loading profile image: ", error);
      }
    };
    fetchProfileImage()
  }, []);




  const navigate = useNavigate();
  const handleLogout = async () => {

    // await signOut(auth);
    localStorage.removeItem("token");
    navigate("/Signin");

  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top" style={{ backgroundColor: "#121520" }}>
      <div className="logo" width="60px" height="60px">
        <img src="/todo-app-logo.png" alt="todolist logo" />
      </div>
      <a className="navbar-brand" href="/" style={{ color: "white", fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif" }}>
        To Do App
      </a>
      {location.pathname === showSearchOn && (
        <div className="search-box">
          <Search size={20} color="black" className="search-icon" />
          <input
            type="text"
            placeholder="Search Tasks"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }
            }
          />
        </div>
      )}
      <NotificationBell />
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* <div className="d-flex align-items-center gap-3">
      {location.pathname === '/' && (
        <a className="nav-link" href="/pages/Add" style={{ backgroundColor: "#7C5CFC", color: "white", borderRadius: "20px", padding: "8px 18px" }}>
          Add Task
        </a>
     )}
     </div> */}
      {/* {location.pathname === '/' && (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="/pages/Add"
                style={{
                  backgroundColor: "#7C5CFC",
                  color: "white",
                  borderRadius: "20px",
                  padding: "8px 18px"
                }}

              >
                Add Task
              </a>
            </li>
          </ul> */}
        {/* </div>)} */}
      <div className="profile-menu">
        <button
          onClick={() => setShowProfile(prev => !prev)}
          className="profile-icon-btn"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="navbar-profile-img"
            />

          ) : (
            <FaUserCircle size={35} color="white" />
          )}
        </button>

      {showProfile && (
        <div className="profile-dropdown">
          <Profile
            onClose={() => setShowProfile(false)}
            setProfileImage={setProfileImage}
          />
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              backgroundColor: "#7B48ED",
              border: 0,
              // borderRadius: "20px",
              color: "white",
              marginTop: "10px",
              marginBottom: "10px"
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
    </nav >
  );
}