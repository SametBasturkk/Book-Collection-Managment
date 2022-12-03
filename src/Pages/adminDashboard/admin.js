import React from "react";

const isAdmin = () => {
    if (localStorage.getItem("userRole") === "admin") {
        return true;
    }
    else {
        return false;
    }
}
const Admin = () => {
    if (isAdmin()) {
        return (
            <div>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the admin dashboard</p>
            </div>
        )
    } else {
        window.location.href = "/";
    }


}

export default Admin;