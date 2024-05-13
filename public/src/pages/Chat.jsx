import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Form, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import SearchBar from "./SearchBar";


export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [originalContacts, setOriginalContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showform, changeShowForm] = useState(false);

  useEffect(() => {
    // Fetch current user data from localStorage
    const storedUser = localStorage.getItem(
      process.env.REACT_APP_LOCALHOST_KEY
    );
    if (!storedUser) {
      navigate("/login"); // Redirect to login if no user data found
    } else {
      setCurrentUser(JSON.parse(storedUser)); // Set current user from localStorage
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host); // Establish socket connection
      socket.current.emit("add-user", currentUser._id); // Add user to online users

      socket.current.on("online-users", (users) => {
        setOnlineUsers(users); // Update online users list
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        // Fetch contacts data from server
        axios
          .get(`${allUsersRoute}/${currentUser._id}`)
          .then((response) => {
            setContacts(response.data); // Set contacts array
            setOriginalContacts(response.data); // Set original contacts array
          })
          .catch((error) => {
            console.error("Error fetching contacts:", error);
          });
      } else {
        navigate("/setAvatar"); // Redirect if avatar image is not set
      }
    }
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat); // Update current chat
    
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.trim().toLowerCase(); // Convert search term to lowercase

    if (searchTerm === "") {
      setContacts(originalContacts); // Restore original contacts array
    } else {
      // Filter contacts based on search term
      const filteredContacts = originalContacts.filter((contact) =>
        contact.username.toLowerCase().includes(searchTerm)
      );
      setContacts(filteredContacts); // Update contacts array with filtered contacts
    }
  };

  return (
    <>
      <Container>
        <SearchBar handleSearch={handleSearch} />

        <div className="container">
          <Contacts
            contacts={contacts}
            changeChat={handleChatChange}
            onlineUsers={onlineUsers}
          />

          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: rgb(212 212 229);

  .container {
    height: 85vh;
    width: 85vw;
    margin-bottom:2rem;
    background: linear-gradient(to right, #41295a, #2f0743);
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
