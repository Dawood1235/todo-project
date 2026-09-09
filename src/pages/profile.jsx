// import { AlertOctagon } from "lucide-react";
import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
// import {auth,db,storage} from "../firebase";
// import {doc,getDoc, updateDoc} from "firebase/firestore";
import axios from "axios";
import { UserContext } from "../ContextProvider";

export default function Profile({ onClose, setProfileImage }) {
    const { user,setUser, loading: userLoading } = useContext(UserContext);


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Clear any cached user data
        setShowProfile(false);
        navigate("/Signin");
    };

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     console.log("========== PROFILE STATE ==========");
    //     console.log("firstName state:", firstName);
    //     console.log("lastName state:", lastName);
    //     console.log("email state:", email);
    //     console.log("profilePic state:", profilePic);
    // }, [firstName, lastName, email, profilePic]);



    //     const fetchProfile = async () => {
    //         console.log("========== FETCH PROFILE START ==========");
    //         try {
    //             const token = localStorage.getItem("token");

    //             console.log("1. TOKEN:", token);
    //             console.log("2. TOKEN EXISTS:", !!token);


    //             const response = await axios.get("http://localhost:5000/api/profile",
    //                 {
    //                     headers:
    //                     {
    //                         Authorization: `Bearer ${token}`
    //                     }
    //                 }
    //             );

    //             console.log("3. FULL AXIOS RESPONSE:", response);
    //             console.log("4. RESPONSE STATUS:", response.status);
    //             console.log("5. RESPONSE DATA:", response.data);

    //             const data = response.data;

    //             console.log("6. firstName:", data.firstName);
    //             console.log("7. lastName:", data.lastName);
    //             console.log("8. email:", data.email);
    //             console.log("9. profilePic:", data.profilePic);


    //             console.log("PROFILE DATA FROM BACKEND:", data);

    useEffect(() => {
                   if(user){
                setFirstName(user.firstName || "");
                setLastName(user.lastName || "");
                setEmail(user.email || "");
                setProfilePic(user.profilePic || "");
        }
    }, [user]);
    //         } catch (error) {
    //             console.log("========== PROFILE ERROR ==========");
    //             console.log("ERROR:", error);
    //             console.log("ERROR MESSAGE:", error.message);
    //             console.log("ERROR RESPONSE:", error.response);
    //             console.log("ERROR RESPONSE DATA:", error.response?.data);
    //             console.log("ERROR STATUS:", error.response?.status);
    //         }
    //     };
    //     fetchProfile()
    // }, []);

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (file) {

            setSelectedFile(file);
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePic(reader.result);
            }

            reader.readAsDataURL(file);

        }
    };

    const handleSave = async () => {

        setLoading(true);

        try {
            // const userRef = doc(db,"users",user.uid);

            const token = localStorage.getItem("token");

            let imageUrl = profilePic;

            if (selectedFile) {

                const formData = new FormData();

                formData.append("file", selectedFile);

                formData.append(
                    "upload_preset",
                    "profile_images"
                );

                const cloudinaryResponse = await axios.post(
                    "https://api.cloudinary.com/v1_1/doslqxoxg/image/upload",
                    formData
                );
                imageUrl = cloudinaryResponse.data.secure_url;
            }

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/profile`,
                {
                    firstName: firstName,
                    lastName: lastName,
                    profilePic: imageUrl
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )

            setUser((prev)=>({
                ...prev,
                firstName,
                lastName,
                profilePic: imageUrl
            }));
            
            setProfileImage(imageUrl);
            alert("Profile updated successfully");
            onClose();

        } catch (error) {
            console.log("Error updating profile:", error);
            console.log("Error:", error);
            console.log("Response:", error.response?.data);
            console.log("Status:", error.response?.status);

        }
        finally {
            setLoading(false);
        }
    };
    return (
        <div className="profile-modal">
            <div className="profile-modal-content">
                <button
                    className="close-btn"
                    onClick={onClose}>
                    x
                </button>
                <h2>My Profile</h2>

                <div className="avatar-section">
                    {/* The label links the click event to the hidden file input below */}
                    <input
                        id = "avatarUpload"
                        type= "file"
                        accept = "image/*"
                        onChange={handleFileChange}
                        style= {{display:"none"}}
                    />


                    <label htmlFor="avatarUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="avatar-circle">
                            {/* Dynamically grab the first letter of the first name for the avatar */}
                                {profilePic ? (
                                    <img
                                       src={profilePic}
                                       alt="Profile"
                                       className="avatar-image"
                                    />
                                ): (
                                    <span className = "avatar-initial">
                                        {firstName
                                            ? firstName.charAt(0).toUpperCase(): "S"}
                                    </span>
                                ) }
                            <div className="camera-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                        <span className="change-photo-text">Change photo</span>
                    </label>
                </div>

                <div className="profile-field">
                    <label>First Name</label>

                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) =>
                            setFirstName(e.target.value)
                        }
                    />
                </div>

                <div className="profile-field">
                    <label>Last Name</label>

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) =>
                            setLastName(e.target.value)
                        }
                    />
                </div>


                <div className="profile-field">
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        disabled
                    />
                </div>

                <button
                    className="close-btn-prf"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}


{/* import React from 'react';
import './ProfileDropdown.css'; // Make sure to create and import this CSS file

const ProfileDropdown = ({ onClose }) => {
  return (
    <div className="profile-dropdown-container">
      {/* Header */}
{/* <div className="dropdown-header">
        <h3>My Profile</h3>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &#x2715; Simple text 'X' or replace with an SVG icon */}
{/* </button>
      </div> */}

{/* Avatar Upload Section */ }
{/* <div className="avatar-section">
        <div className="avatar-circle">
          <span className="avatar-initial">S</span>
          <div className="camera-badge">
             You can use a FontAwesome icon or SVG here
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>
        <span className="change-photo-text">Change photo</span> */}
{/* Hidden file input triggered by clicking the avatar */ }
{/* <input type="file" id="avatarUpload" style={{ display: 'none' }} />
      </div> */}

{/* Profile Form */ }
{/* <form className="profile-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" defaultValue="Saleem" />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" defaultValue="Elahi" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" defaultValue="saleem987@gmail.com" className="active-input" />
        </div> */}

{/* Action Buttons */ }
{/* <div className="button-group">
          <button type="submit" className="btn-primary-save">Save Changes</button>
          <button type="button" className="btn-secondary-logout">Logout</button>
        </div>
      </form>
    </div>
  );
}; */}

{/* export default ProfileDropdown;  */ }