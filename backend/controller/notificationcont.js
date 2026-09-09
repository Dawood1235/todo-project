const Notification = require("../models/notification");

const getNotifications = async(req,res)=>{
    try{
        const notifications = await Notification.find({
            userId: req.userId,
        }).sort({
            createdAt: -1
        });

        res.status(200).json(notifications);
    }

    catch(error){
        console.error("Get notifications error:",
        error);

        res.status(500).json({
            message: "Failed to get notifications"
        });
    }
}


const markNotificationAsRead = async(req, res)=>{
    try{
        const notification = await Notification.updateMany(
            {
                userId: req.userId,
                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        console.log("USER:", req.userId);
        console.log("MATCHED:", notification.matchedCount);
        console.log("MODIFIED:", notification.modifiedCount);


        if(notification.modifiedCount === 0){
            return res.status(404).json({
                message: "No unread ones found"
            })
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            message: "Failed to mark notification as read"
        })
    }
}

module.exports = {
    getNotifications,markNotificationAsRead
};