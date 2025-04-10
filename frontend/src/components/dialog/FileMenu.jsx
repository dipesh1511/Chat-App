import { Menu } from "@mui/material";
import React from "react";

const FileMenu = ({ anchorE1 }) => {
  return (
    <div>
      <Menu ancherE1={anchorE1} open={false}>
        <div
          style={{
            width: "10rem",
          }}
        >
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi soluta
          officiis rerum explicabo repellendus, quis accusamus sapiente
          consequatur dolor iste in reiciendis a excepturi dicta sunt
          blanditiis, quam dolorum consequuntur deserunt iusto? Nemo, possimus
          distinctio.
        </div>
      </Menu>
    </div>
  );
};

export default FileMenu;
