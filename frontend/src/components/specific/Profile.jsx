import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import moment from "moment";

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectivefit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />

      <ProfileCard heading={"Bio"} text={"cvgxfcdfbhsdgfuywd"} />
      <ProfileCard
        heading={"Username"}
        text={"Dipesh1511"}
        Icon={<UserNameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={"jai ho baba ki"}
        //dikh nhi rhi hai
        Icon={<FaceIcon />}
      />

      <ProfileCard
        heading={"Joined"}
        text={moment("2023-11-04T18:30:00.000Z").fromNow()}
        Icon={<CalenderIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {icon && icon}

    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);
export default Profile;
