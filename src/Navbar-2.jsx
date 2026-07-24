import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar(){
  const navigate = useNavigate();
  const handleLogout = async () => {

        await signOut(auth);

        navigate("/Signin");

    };
return(<nav className="navbar navbar-expand-lg navbar-light bg-light">
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
</nav>
);
}