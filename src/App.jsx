import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import SignUpPage from "./pages/Signup";
import SignInPage from "./pages/Signin";
import UserManagement from "./pages/user-management";
import ProtectedRoute from "./ProtectedRoute";
// import { UserContext,  UserProvider } from "./ContextProvider";
import PublicOnlyRoute from "./PublicOnlyRoute";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/Index';
import Details from './pages/Details';
import AddData from "./pages/Add";
import Unauthorized from "./unauthorized";
import Statistics from "./Statistics";
import AdminDashboard from "./pages/Admin-dashboard";

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
  
// export default App;



