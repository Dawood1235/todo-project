import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import SignUpPage from "./pages/Signup";
import SignInPage from "./pages/Signin";
import UserManagement from "./pages/user-management";
import ProtectedRoute from "./ProtectedRoute";
// import { UserContext,  UserProvider } from "./ContextProvider";
import PublicOnlyRoute from "./PublicOnlyRoute";
import {auth} from './firebase';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
// import { app } from './firebase';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/Index';
import Details from './pages/Details';
import AddData from "./pages/Add";
import { FirebaseError } from "firebase/app";
import Unauthorized from "./unauthorized";
import Statistics from "./Statistics";
import AdminDashboard from "./pages/Admin-dashboard";


// const auth = getAuth(app);
//<UserProvider>

export default function App() {
return(
<BrowserRouter>

<Routes>
<Route path="/signup" element={<PublicOnlyRoute>
<SignUpPage/>
</PublicOnlyRoute>
}
/>

<Route path="/Signin" element={<PublicOnlyRoute>
<SignInPage/>
</PublicOnlyRoute>
}
/>

<Route
path="/"
element={
<ProtectedRoute role="user">
    <Homepage/>
</ProtectedRoute>

}
/>
<Route
path="/pages/Add"
element={
<ProtectedRoute role="user">
    <AddData/>
</ProtectedRoute>
}
/>

<Route
path="/task/:id" 
element={<ProtectedRoute role="user">
    <Details /> 
</ProtectedRoute>
}
/>

<Route
path="/pages/Admin-dashboard"
element={
<ProtectedRoute role="admin">
    <AdminDashboard />
</ProtectedRoute>
}
/>

<Route
path="/Statistics"
element={
<ProtectedRoute role="admin">
    <Statistics />
</ProtectedRoute>
}
/>

<Route
path="/user-management"
element={
<ProtectedRoute role="admin">
    <UserManagement />
</ProtectedRoute>
}
/>

<Route
path="/unauthorized"
element={<Unauthorized/>}
/>

</Routes>

</BrowserRouter>


);

}

// </UserProvider>
//   return (<ContextProvider>
//     <BrowserRouter>
//   <Routes>

//     {/* Public Routes */}
//     <Route path="/pages/Signup" element={<SignUpPage />} />
//     <Route path="/pages/Signin" element={<SignInPage />} />

//     {/* Any logged-in user */}
//     <Route path="/" element={
//       <ProtectedRoute roles={[]}>
//         <Homepage/>
//        </ProtectedRoute>
//     }/>

//     {/* Admin only */}
//     <Route path = "/pages/Add" element={
//     <ProtectedRoute roles ={["admin"]}>
//         <AddData/>
//      </ProtectedRoute>
//     }/>

//   </Routes>
// </BrowserRouter>
// </ContextProvider>
  
// export default App;



