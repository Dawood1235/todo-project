import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { app } from "../firebase";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const SignUpPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = getAuth(app);
    const navigate = useNavigate();

    const createUser = async () => {
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid),{
                email: user.email,
                role: "user"
            });

        alert("Succesfully added");
        navigate("/Signin");
    } catch(error){
        console.log(error);
    }

    };
    return (

    
 
        <div className="container d-flex justify-content-center align-items-center vh-100">
  <div className="card shadow p-4" style={{ width: "400px" }}>
    <h2 className="text-center mb-4">Sign Up</h2>

    <div className="mb-3">
      <label className="form-label">Username</label>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
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
      className="btn btn-primary w-100"
      onClick={createUser}
    >
      Sign Up
    </button>
  </div>
</div>
    );

};

export default SignUpPage;

