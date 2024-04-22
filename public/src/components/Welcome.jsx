import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../assets/Animation - 1710938461614.json";
import styled from "styled-components";
export default function Welcome() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <Container>
      <Lottie options={defaultOptions} height={200} width={200} />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: linear-gradient(
    68.2deg,
    rgb(3, 126, 243) -0.3%,
    rgb(48, 195, 158) 100.2%
  );
  flex-direction: column;

  span {
    color: darkblue;
  }

  h3 {
    padding: 10px;
  }
`;
