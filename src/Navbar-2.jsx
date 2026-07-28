import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import Profile from "./pages/profile"
import {FaUserCircle} from "react-icons/fa";


export default function Navbar(){
  const [showProfile,setShowProfile]=useState(false);

  
    
  
  const navigate = useNavigate();
  const handleLogout = async () => {

        await signOut(auth);

        navigate("/Signin");

    };
return(
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="navbar-brand" href="#">
    To Do App 
  </a>
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
  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <a className="nav-link" href="/">
          Home <span className="sr-only"></span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/pages/Add">
          Add
        </a>
      </li>
      <li className="nav-item">
        <button onClick={handleLogout} className="nav-link">
          Logout
        </button>
      </li>
    </ul>
  </div>
  <div className="profile-menu">
  <button
      onClick = {()=>setShowProfile(true)}
      className="profile-icon-btn"
      >
        <FaUserCircle size={35} />
      </button>
      {showProfile && (
        <div className="profile-dropdown">
        <Profile
          onClose={()=>setShowProfile(false)}
      />
      </div>
  )}
  </div>
</nav>
);
}