import { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const NotificationBell = () => {

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchNotifications = async () => {

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
        //     const unreadNotifications = response.data.filter(
        //     notification => !notification.read
        // );

        setNotifications(response.data);


        }

        catch (error) {

            console.error(
                "Failed to fetch notifications:",
                error
            );
        }
    };

    useEffect(() => {

        fetchNotifications();

        const interval = setInterval(()=>{
            fetchNotifications();
        }, 5000);

        return ()=> clearInterval(interval)
    }, []);

    const unreadCount = notifications.filter(
        notification => !notification.read
    ).length;

    const markasread = async()=>{

        try{
            console.log("🔔 Clicked notification");
            const token = localStorage.getItem('token');
         
            const response = await axios.patch(
                'http://localhost:5000/notifications/notpat',
                {},
                {
                 headers: {
                    Authorization: `Bearer ${token}` 
                 }
                }
            );

            setNotifications(prevNotifications => prevNotifications.map(notification => ({
                ...notification,
                read: true
            }))
            );

            console.log("✅ PATCH SUCCESS"); 
            console.log("📦 Status:", response.status); 
            console.log("📦 Response:", response.data);


            
        console.log("✅ Frontend notification marked as read");
            
        }catch(error){
            console.error(
                "Failed to mark notification as read"
            )
        }
    }

    return (
        <div className="notification-container">

            <button
                className="notification-button"
                onClick={() =>{   
                    if(!showNotifications){
                        markasread()
                    }    
                    setShowNotifications(prev => !prev);
                }}
            >
                <Bell size={24} />

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        <sup>
                            {unreadCount}
                        </sup>
                    </span>
                )}

            </button>

            {showNotifications && (
                <div className="notification-panel">
                    {notifications.length === 0 ? (
                        <p>No notification</p>
                    ) : (
                        notifications.map(notification => (

                            <div
                                key={notification._id}
                                className={
                                    notification.read
                                        ? "notification read"
                                        : "notification unread"
                                }
                            >
                                <p>
                                    {notification.message}
                                </p>

                                <small>
                                    {new Date(
                                        notification.createdAt).toLocaleString()}
                                </small>

                            </div>
                        ))
                    )}

                </div>
            )}
        </div>
    );
};

export default NotificationBell;