import React, { useEffect } from 'react';
import Lottie from "react-lottie";
import animationStartUp from "../assets/animationStartUp.json";
import { useNavigate } from 'react-router-dom';

function FrontPage() {
  // inital welcome
const navigate = useNavigate();

useEffect(() => {
    setTimeout(() => {
        navigate('/login'); 
    }, 3000);
  }, []);

  //Lottie animation default setting
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationStartUp, // the JSON data imported above
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Welcome to LiveLine content custom inline css
  const textColor = {
    fontSize: "50px",
    fontWeight: "600",
    background: "linear-gradient(to left, #553c9a, #b393d3)",
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    display: "flex",
    justifyContent: "center", // Center horizontally
    alignItems: "center",
    marginLeft: "1rem",
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={440} width={500} />
      <h1 style={textColor}>Welcome To LiveLine</h1>
    </div>
  );
}

export default FrontPage