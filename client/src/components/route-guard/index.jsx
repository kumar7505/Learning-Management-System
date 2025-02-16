import React, { Fragment } from 'react'
import { useLocation, Navigate } from 'react-router-dom'

function RouteGuard({authenticated, user, element}){
    
    const location = useLocation();

        
    if (!authenticated && !location.pathname.includes("/auth")) {
        return <Navigate to="/auth" />;
    }

    if (
        authenticated &&
        user.role === "instructor" &&
        !location.pathname.includes("instructor")) {
        return <Navigate to="/instructor" />;
    }

    if (
        authenticated &&
        user?.role !== "instructor" &&
        (location.pathname.includes("instructor") ||
          location.pathname.includes("/auth"))) {
        return <Navigate to="/home" />;
    }
    
    return <Fragment>{element}</Fragment>;
}

export default RouteGuard;

