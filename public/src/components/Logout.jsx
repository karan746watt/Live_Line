import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import Swal from "sweetalert2";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const tellme = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to log out ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log out"
    });
    if (!tellme.value) return;

    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;

    const data = await axios.get(`${logoutRoute}/${id}`);

    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  border-radius: 0.5rem;
  background-color: #073980;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
