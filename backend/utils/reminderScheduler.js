const cron = require("node-cron");
const Task = require("../models/todo");
const notification = require("../models/notification");

console.log("🚀 REMINDER SCHEDULER FILE LOADED");

cron.schedule("* * * * *", async () => {

    try {

        const now = new Date();

        console.log("=================================");
        console.log("CRON RUN:", now);
        console.log("=================================");

        const tasks = await Task.find({
            reminder: true,
            reminderSent: false
        })

        tasks.forEach(task => {
            console.log({
                id: task._id,
                task: task.task,
                date: task.date,
                time: task.time,
                reminder: task.reminder,
                reminderSent: task.reminderSent
            });
        })

        console.log("TASKS FOUND:", tasks.length);
        console.log("TASKS:", tasks);

        for (const task of tasks) {

            // const taskDateTime = new Date(task.date);

            const dateString = new Date(task.date).toISOString().split("T")[0];

            const [hours, minutes] = task.time.split(":");

            const taskDateTime = new Date(
                `${dateString}T${task.time}:00+05:00`
            );


            // taskDateTime.setHours(
            //     Number(hours),
            //     Number(minutes),
            //     0,
            //     0
            // );

            console.log("=================================");
            console.log("TASK ID:", task._id);
            console.log("TASK NAME:", task.task);
            console.log("TASK DATE FROM DB:", task.date);
            console.log("TASK TIME FROM DB:", task.time);
            console.log("TASK DATETIME:", taskDateTime);


            const reminderTime = new Date(
                taskDateTime.getTime() - (2 * 60 * 60 * 1000)
            );

            console.log("TASK:", task.task);
            console.log("TASK DATE:", task.date);
            console.log("TASK TIME:", task.time);
            console.log("CURRENT TIME:", now.toISOString());
            console.log(
                "CALCULATED REMINDER TIME:",
                reminderTime.toISOString()
            );

            console.log(
                "TIME DIFFERENCE:",
                reminderTime.getTime() - now.getTime()
            );

            if (now >= reminderTime && now < taskDateTime) {
                console.log("🔔 REMINDER TIME REACHED!");

                await notification.create({
                    userId: task.userId,
                    taskId: task._id,
                    message: `${task.task} is due in 2 hours`
                })

                task.reminderSent = true;

                await task.save();
            }
        }

    } catch (error) {
        console.error("Reminder scheduler error:", error)

    }

});
