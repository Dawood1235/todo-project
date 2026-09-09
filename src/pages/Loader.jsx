import { useState, useEffect } from 'react';


export default function SPLoader() {

    return (
                <div
            style={{
                position: "fixed",
                inset: 0,
                // top: "50%",
                // left: "50%",
                // width: "100%",
                // minHeight: "70vh",
                backgroundColor: "#0d0f1a",
                // transform: "translate(-50%,-50%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                // pointerEvents: "none"
            }}
        >
            <div className="text-center">
                <div
                    className="spinner-border text-primary"
                    style={{ width: "4rem", height: "4rem" }}
                    role="status"
                ></div>

                <p className="mt-3 fw-bold" style={{color:"white"}}>Loading...</p>
            </div>
        </div>
    );

}