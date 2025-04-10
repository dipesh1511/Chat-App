import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete Chat", _id, groupChat);
    };

    return (
      <>
        <Title />
        <Header />

        <Grid
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "0.8fr 1.2fr 1fr",
            },
            height: "calc(100vh - 4rem)",
          }}
        >
          {/* Left Sidebar */}
          <Grid
            sx={{
              display: { xs: "none", sm: "block" },
              height: "100%",
            }}
          >
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              // newMessagesAlert={[{
              //     chatId,
              //     count: 4,
              // }]}

              // onlineUsers={["1","2"]}
            />
          </Grid>

          {/* Main Content */}

          <Grid>
            <WrappedComponent {...props} />
          </Grid>

          {/* Right Sidebar */}
          <Grid
            sx={{
              display: { xs: "none", md: "block" },
              bgcolor: "black",
              height: "100%",
            }}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
