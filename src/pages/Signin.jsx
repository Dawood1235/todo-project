import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { app } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import SPLoader from "./Loader";
import * as yup from 'yup';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const auth = getAuth(app);

const schema = yup.object({
  email: yup.string().required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});


const SignInPage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const signinUser = async () => {
    setLoading(true);
    try {
      await schema.validate({ email, password }, { abortEarly: false });
      // const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // const snapshot = await getDoc(doc(db, "users", userCredential.user.uid));

      // const data = snapshot.data();

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/signin`,
        {
          email,
          password
        }
      );

      console.log(response.data);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));


      setLoading(false);

      // alert("Successfully signed in");
      if (response.data.user.role === "admin") {
        navigate("/pages/Admin-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};

        error.inner.forEach((err) => {
          newErrors[err.path] = err.message
        });
        setErrors(newErrors);
        console.log(newErrors);
      }
      else {
        if (!navigator.onLine) {
          toast.error("No internet connection.");
        } else if (error.code === "ERR_NETWORK") {
          toast.error("Cannot connect to the server.");
        }
        else {
          toast.error(error.response?.data?.message ||
            "Invalid email or password");
        }
      }
    } finally {
      setLoading(false);
    }

  };
  return (
    <>
      <ToastContainer />
     <div className="sign-page">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: "400px" }}>
          <h2 className="text-center mb-4">Sign In</h2>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="Enter your username"
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="Enter your password"
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          </div>

          <div className='mb-3'>
            <button
              className="btn btn-success w-100"
              onClick={signinUser}
            >
              {/* Sign In */}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="text-center mt-3 mb-0">
            Don't have an account?{" "}
            <Link to="/Signup">Sign Up</Link>
          </p>
        </div>
      </div>
      </div>
    </>
  );

};

export default SignInPage;