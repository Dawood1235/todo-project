import { useState, useEffect } from 'react';


export default function SPLoader() {

    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 3000)
    //     return () => { clearTimeout(timer) }

    // }, [])

    // if (!loading) return null;

    return (
                <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                backgroundColor: "rgba(255,255,255,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >
            <div className="text-center">
                <div
                    className="spinner-border text-primary"
                    style={{ width: "4rem", height: "4rem" }}
                    role="status"
                ></div>

                <p className="mt-3 fw-bold">Loading your tasks...</p>
            </div>
        </div>
    );

}