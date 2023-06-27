import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppLayout() {


  const { user, isLoading, logout, isAuthenticated, loginWithRedirect  } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      
      
      <div className="header">
        <div className="title">
          <h1>Note Taking App</h1>
        </div>
        <div className="buttons">
          {!isAuthenticated && (
            <button className="btn-primary" onClick={loginWithRedirect}>
              Login
            </button>
            )}
          {!isAuthenticated && <button className="btn-secondary" onClick={signUp}>
            Sign up
            </button>}
          {isAuthenticated &&<button
              className="exit-button"
              onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
            </button>}
            
        </div>
          {isAuthenticated &&<div className="welcome-message">Welcome 👋 {user.name} </div>}
        <nav className="menu">
          <ul className="menu-list">
            <li>
            <Link to="/app">Home</Link>
            </li>
            <li>
            {!isAuthenticated ? (<Link to="/notes">Notes</Link>) : (
              <Link to="/app/notes">Notes</Link>
            )}
            </li>
            <li>
              <Link to="/app/profile">Profile</Link>
            </li>
            <li>
              <Link to="/app/debugger">Auth Debugger</Link>
            </li>
          </ul> 
        </nav> 
        
            
            
              
              
            
          
        
        
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
