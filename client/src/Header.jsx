import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";
import { SiMicrodotblog } from 'react-icons/si';

const Header = () => {
  const{setUserInfo,userInfo}=useContext(UserContext);

  const logout=()=>{
    fetch("http://localhost:4000/logout",{
      method: 'POST',
      credentials:'include'
    });
    setUserInfo(null);
  }

  
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const username=userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo">
      Blogs<sup style={{color:"#888"}}><SiMicrodotblog/></sup>
      </Link>
      <nav>
        {username && (
          <><label class="dropdown">

          <div class="dd-button">
          <b>Hello, {username}</b>
          </div>
        
          <input type="checkbox" class="dd-input" id="test" />
        
          <ul class="dd-menu">
            <li><span><b>Hello, {username}</b></span></li>
            <li> <Link to="/create">Create New Post</Link></li>
           
            <li>
            <a className="headerlink" onClick={logout} href="/#">Logout</a>
            </li>
          </ul>
          
        </label>
           
           
            
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
