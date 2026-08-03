import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword,signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { app } from "../firebase";
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import 'bootstrap/dist/css/bootstrap.min.css';

const schema = yup.object({
  firstName: yup.string().required("Please enter your first name"),
  lastName: yup.string().required("Please enter your last name"),
  email: yup.string().required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});


const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const auth = getAuth(app);
  const navigate = useNavigate();

  const createUser = async () => {
    setLoading(true);
    try {
      await schema.validate({ firstName, lastName, email, password }, { abortEarly: false });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        lowerfirstName: firstName.toLowerCase().trim(),
        lowerlastName: lastName.toLowerCase().trim(),
        email: user.email,
        role: "user"
      });

      await signOut(auth);
      setLoading(false);
      alert("Succesfully added");
      navigate("/Signin");
    } catch (error) {
      setLoading(false);
      if (error instanceof yup.ValidationError) {
        const newErrors = {};

        error.inner.forEach((err) => {
          newErrors[err.path] = err.message
        });
        setErrors(newErrors);
        console.log(newErrors);
      }
      else {
        console.log("error signing up");
      }
    }

  };

  return (



    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              setErrors((prev) => ({ ...prev, firstName: "" }));
            }}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              setErrors((prev) => ({ ...prev, lastName: "" }));
            }}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
        </div>

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
            placeholder="Enter your email"
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
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Enter your password"
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={createUser}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </div>
    </div>
  );

};

export default SignUpPage;

