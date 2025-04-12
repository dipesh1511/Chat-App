import React from "react";
import { TransformImage } from "../../lib/Features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "value":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img
          src={TransformImage(url, 200)}
          alt="Attachment"
          height="150px"
          width={"200px"}
          style={{
            objectFit: "contain",
          }}
        />
      );
    case "audio":
      return <audio src={url} preload="none" controls />;

    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachment;
