import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();





    return <button className="btn btn-dark" onClick={() => loginWithRedirect()}>Log In - Register</button>;
};

export default LoginButton;