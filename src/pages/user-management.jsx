import { collection, getDocs,doc,deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import Navbar from "../Navbar";

export default function UserManagement() {

    const [data, setData] = useState([]);

    async function handleDelete(id) {
            try {
                await deleteDoc(doc(db, "tasks", id));
            
            setData((prevTasks)=> prevTasks.filter((task)=> task.id!==id));
            }
            catch(error){
                alert("Error deleting task");
            }
        }

    const fetchData = async () => {
        const userRefs = collection(db, "tasks");
        try {
            const querySnapshot = await getDocs(userRefs);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }
    // ADD THIS


    useEffect(() => {
        fetchData();
    }, []);



    return (
        <div>
            <Navbar/>
            <h1>All Tasks</h1>

            <table className="styled-table">
                <tbody>
                    {
                        data.map((item, index) => {
                            return (
                                    <tr className="trow" key={item.id}>
                                        <td>{item.task}</td>
                                        <td>{item.description}</td>
                                        <td>{item.date}</td>
                                        <td>{item.time}</td>
                                        <td>{item.category}</td>
                                        <td>{item.priority}</td>
                                        <td>{item.progress}</td>
                                        <td>{item.progress}</td>
                                        <td>{item.link}</td>
                                        {/* <td><button onClick={handleEdit}>Edit</button></td> */}
                                        <td><button onClick={()=>handleDelete(item.id)}>Delete</button></td>
                                    </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}





