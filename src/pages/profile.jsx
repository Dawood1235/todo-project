import {useEffect, useState } from "react";
import {auth,db,storage} from "../firebase";
import {doc,getDoc, updateDoc} from "firebase/firestore";


export default function Profile({onClose,setProfileImage}){
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");

    const [email,setEmail] = useState("");
    const [profilePic,setProfilePic] = useState("");
    const [selectedFile,setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchProfile = async() =>{
            const user = auth.currentUser;

            if(!user){
                return;
            }

            setEmail(user.email);

            try{
                const userRef = doc(db,"users",user.uid);
                const userSnap = await getDoc(userRef);

                if(userSnap.exists()){
                    const data = userSnap.data();

                    setFirstName(data.firstName||"");     
                    setLastName(data.lastName||"");    
                    setProfilePic(data.profilePic||"");
                }
            } catch(error){
                console.log("Error fetching data",error);
            }
        };
        fetchProfile()
    }, []);

    const handleFileChange = (e) =>{
        const file = e.target.files[0];
        if(file){
            setSelectedFile(file);
            const reader=new FileReader()
            reader.onloadend=()=>{
                setProfilePic(reader.result);
            }

            reader.readAsDataURL(file);

        }
    };

    const handleSave = async() =>{
        const user = auth.currentUser;

        if(!user){return};

        setLoading(true);

        try{
            const userRef = doc(db,"users",user.uid);

            await updateDoc(userRef,{
                firstName: firstName,
                lastName: lastName,
                profilePic: profilePic
            })
            
            setProfileImage(profilePic);

            alert("Profile Created SUccessfully");
            onClose();

        }catch(error){
            console.log("Error updating profile");
        }
        setLoading(false);
        
    };
    return(
        <div className = "profile-modal">
            <div className = "profile-modal-content">
                <button
                    className="close-btn"
                    onClick={onClose}>
                        x
                    </button>
                    <h2>My Profile</h2>
                    <div className = "profile-picture-container">
                        {/* <img
                            src={
                                profilePic || 
                                "https://via.placeholder.com/100"
                            }
                            alt="Profile"
                            className="profile-picture"
                        /> */}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            />
                        
                        </div>

                        <div className="profile-field"> 
                            <label>First Name</label>

                            <input
                                type="text"
                                value={firstName}
                                onChange={(e)=>
                                    setFirstName(e.target.value)
                                }
                            />
                        </div>

                        <div className="profile-field">
                            <label>Last Name</label>

                            <input
                                type="text"
                                value={lastName}
                                onChange={(e)=>
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
                        className="close-btn"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading?"Saving..." : "Save Changes"}
                    </button>

                    </div>
        </div>
    );
}
