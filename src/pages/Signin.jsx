import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import 'bootstrap/dist/css/bootstrap.min.css';

const auth = getAuth(app);


const SignInPage = () => {

    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
       
    const signinUser = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential)=>{
            const snapshot = await getDoc(doc(db, "users", userCredential.user.uid));

            const data = snapshot.data();
            alert("Successfully signed in");
            if (data.role === "admin") {
              navigate("/pages/Admin-dashboard");
            } else {
                navigate("/");
            }

          }

        )};

        

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
  <div className="card shadow p-4" style={{ width: "400px" }}>
    <h2 className="text-center mb-4">Sign In</h2>

    <div className="mb-3">
      <label className="form-label">Username</label>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your username"
        required
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Password</label>
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
    </div>

    <button
      className="btn btn-success w-100"
      onClick={signinUser}
    >
      Sign In
    </button>

    <p className="text-center mt-3 mb-0">
      Don't have an account?{" "}
      <a href="/Signup">Sign Up</a>
    </p>
  </div>
</div>
    );

};

export default SignInPage;