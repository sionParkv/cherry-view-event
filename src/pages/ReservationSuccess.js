import { Container, Box } from "@mui/material";
import React from "react";

import "../assets/ReservationSuccess.scss";
import { images } from "../images/index";

const ReservationSuccess = () => {
  return (
    <Container className="ReservationSuccess">
      <Box className="Display">
        <img alt="mainImg" src={images.successImg} className="MainBox"></img>
        <img
          alt="mobileImg"
          src={images.mobileSuccess}
          className="MobileBox"
        ></img>
      </Box>
    </Container>
  );
};

export default ReservationSuccess;
