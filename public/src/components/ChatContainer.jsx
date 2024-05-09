import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute,deleteMessageRoute} from "../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteBtn from "./DeleteBtn";
import Swal from "sweetalert2";


export default function ChatContainer({ currentChat, socket }) 
{
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

    const toastOptions = {
    autoClose: 1500,
    pauseOnHover: true,
    draggable: true,
  };

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    // receive all the messages in the db
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });

    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      from: data.username,
      to: currentChat._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current)
    {
      socket.current.on("msg-recieve", ({ msg, from }) => {
        //not using from
        setArrivalMessage({ fromSelf: false, message: msg });

        toast.info(
          <span>
            You have received a new message from <strong>{from}</strong>
          </span>,
          toastOptions
        );
        });
    }
  },[]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  

  const handleDelete=async ()=>{

    // const confirmed = window.confirm(
    //   "Are you sure you want to delete all your messages?"
    // );
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete all your messages?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });
    if (!confirmed.value) {
      // If user cancels, return from the function
      toast.info("Deletion canceled.", { autoClose: 1000 });
      return;
    }

   toast.success("Messages deleted successfully!",{autoClose:1000});
      
    const senderId= await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;

    const receiverId=currentChat._id;
    await axios.post(deleteMessageRoute,{
      senderId,receiverId
    });

//we are delteing the message from rect ui
     const updatedMessages = messages.filter((message) => {
       return !message.fromSelf; // Filter out "sended" messages which are true
     });

     setMessages(updatedMessages);
  }


  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        
        <DeleteBtn handleDelete={handleDelete}/>
        <Logout />

      </div>

      <div className="chat-messages">

        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" :  "received"
                }`}
              >
            
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
       <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {  
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background: #007791;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    background: #1f305e;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: white;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        ${"" /* this is background color of individual messages */}
        background-color: #218B82;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #c54b6c;
      }
    }
  }
`;
