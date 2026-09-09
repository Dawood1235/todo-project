import {useState} from "react";
// import { auth } from "./firebase";
// import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function Navbar(){
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const handleLogout = async () => {

        localStorage.removeItem("token");
        navigate("/Signin");

    };
return(<nav className="navbar navbar-expand-lg">
  <Link className="navbar-brand" to="/pages/Admin-dashboard"
      onClick={() => setLoading(true)}
  >
    To Do App 
  </Link>
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
      <li className="nav-item">
        <Link className="nav-link" to="/user-management">
          User Management
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/Statistics">
          Statistics
        </Link>
      </li>
      <li className="nav-item">
        <button onClick={handleLogout} className="nav-link">
          Logout
        </button>
      </li>
    </ul>
  </div>
</nav>
);
}