import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Typography as T,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardDoubleArrowDownOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowDownOutlined";

import "../assets/Reservation.scss";
import { images } from "../images/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reservation = () => {
  const navigate = useNavigate();

  // 텍스트 필드 상태값
  const [values, setValues] = useState({
    email: "",
    contact: "",
    nickname: "",
    number: "",
    agree_promotion_email: false,
    agree_promotion_sms: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  // 비밀번호
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  // 이메일 중복 상태
  const [showButton, setShowButton] = useState(true);
  // 인증 상태
  const [disableText, setDisableText] = useState(true);

  // 인증번호
  const [time, setTime] = useState(180); // 초 단위로 초기값 설정 (3분)
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        if (time > 0) {
          setTime((prevTime) => prevTime - 1);
        } else {
          clearInterval(intervalId);
          setIsActive(false);
        }
      }, 1000); // 1초마다 실행
    }

    return () => clearInterval(intervalId);
  }, [isActive, time]);

  // 인증받기 api
  const handleStart = () => {
    setIsActive(true);

    axios
      .post("http://52.78.42.11/api/verifyNumbers", { contact: values.contact })
      .then((response) => {
        console.log(response.data);
        alert("인증번호가 전송 되었습니다.");
      })
      .catch((error) => {
        console.log("Error", error);
        alert(error.response.data.message);
      });
  };

  // 인증하기 api
  const handleEnd = () => {
    axios
      .patch("http://52.78.42.11/api/verifyNumbers", {
        contact: values.contact,
        number: values.number,
      })
      .then((response) => {
        console.log(response.data);
        setDisableText(false);
        alert("인증 되었습니다.");
      })
      .catch((error) => {
        alert(error.response.data.message);
        console.log("Error", error);
        console.log(values.number);
      });
  };

  // 초를 시:분:초 형태로 변환하는 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // 체크박스
  const [selectAll, setSelectAll] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
  });
  // 전체동의
  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);
    setCheckboxValues({
      checkbox1: checked,
      checkbox2: checked,
      checkbox3: checked,
      checkbox4: checked,
      checkbox5: checked,
      checkbox6: checked,
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));
  };

  const validatePassword = (password) => {
    // 비밀번호가 8자리 이상이고 영문과 숫자가 혼합되어 있는지 확인하는 정규표현식
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  // 비밀번호
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (password_confirmation && newPassword !== password_confirmation) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
    setValidPassword(validatePassword(newPassword));
  };

  // 비밀번호 확인
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setPassword_confirmation(newConfirmPassword);
    if (password && newConfirmPassword !== password) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  // 아이디 중복 검사
  const checkDuplicate = (e) => {
    e.preventDefault();
    console.log("123123", values.email);

    axios
      .post("http://52.78.42.11/api/users/checkDuplicate", {
        email: values.email,
      })
      .then((response) => {
        console.log(response.data);
        setShowButton(false);
      })
      .catch((error) => {
        console.log("Error", error);
        alert(error.response.data.message);
      });
  };

  // 응모하기 버튼
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validPassword || password === "") {
      alert("비밀번호는 8자리 이상, 영문과 숫자 조합으로 입력해야 합니다.");
      console.log("????", password);
    } else if (
      !checkboxValues.checkbox1 ||
      !checkboxValues.checkbox2 ||
      !checkboxValues.checkbox3
    ) {
      alert("필수요소에 체크 해야 합니다.");
    } else if (showButton) {
      alert("이메일 인증을 완료해야 합니다");
    } else if (values.nickname === "") {
      alert("닉네임을 입력해주세요");
    } else if (values.contact === "") {
      alert("연락처를 입력해주세요");
    } else if (disableText) {
      alert("휴대전화 인증을 완료해 주세요");
    }
    axios
      .post("http://52.78.42.11/api/users", {
        email: values.email,
        contact: values.contact,
        nickname: values.email,
        password: password,
        password_confirmation: password_confirmation,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/success");
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.email);
        alert(error.response.data.contact);
        alert(error.response.data.nickname);
      });
  };

  return (
    <Container className="Reservation">
      <Box className="MainBox">
        <Box className="TopContent">
          <img alt="mainImg" className="MainImg" src={images.reservation1} />
          <img
            alt="MobileImg"
            className="MMainImg"
            src={images.Mreservation1}
          />
          <Box className="BottomClick">
            <T>응모하기</T>
            <KeyboardDoubleArrowDownOutlinedIcon />
          </Box>
        </Box>
        <Box className="BottomBox">
          <img alt="SubImg" className="SubImg" src={images.reservation2} />
          <Box className="applicationBox">
            <T className="MainText">
              체리뷰
              <br /> 사전 회원가입 및 <span className="red">응모</span>
            </T>
            <Box className="SubmitBox">
              <Box className="EmailBox">
                <TextField
                  onChange={handleChange}
                  name="email"
                  value={values.email}
                  placeholder="이메일"
                  disabled={!showButton}
                />
                <Button
                  style={{ display: showButton ? "block" : "none" }}
                  onClick={checkDuplicate}
                >
                  중복확인
                </Button>
              </Box>
              {!showButton && (
                <T className="Condition" style={{ color: "#1968ff" }}>
                  인증이 완료 되었습니다.
                </T>
              )}
              <TextField
                onChange={handleChange}
                name="nickname"
                value={values.nickname}
                placeholder="닉네임"
              />

              <TextField
                name="password"
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <T className="Condition">
                비밀번호는 8자리 이상, 영문과 숫자 조합으로 입력해주세요
              </T>
              <TextField
                name="password_confirmation"
                className="One"
                placeholder="비밀번호 확인"
                type="password"
                value={password_confirmation}
                onChange={handleConfirmPasswordChange}
                error={!passwordsMatch}
              />
              {!passwordsMatch && (
                <T className="Error" color="error">
                  비밀번호가 같지 않습니다.
                </T>
              )}
              <Box className="EmailBox">
                <TextField
                  onChange={handleChange}
                  name="contact"
                  value={values.contact}
                  placeholder="연락처"
                  disabled={!disableText}
                />
                <Button onClick={handleStart}>인증받기</Button>
              </Box>
              <Box className="EmailBox">
                <TextField
                  onChange={handleChange}
                  name="number"
                  value={values.number}
                  InputProps={{
                    endAdornment: <T>{formatTime(time)}</T>,
                  }}
                  placeholder="인증번호"
                />
                <Button onClick={handleEnd}>인증하기</Button>
              </Box>

              <FormGroup className="AgreeBox">
                <FormControlLabel
                  className="AllAgree"
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  }
                  label="전체 동의"
                />
                <Box className="Section"></Box>
                <Box className="DetailBox">
                  <FormControlLabel
                    className="Agree"
                    control={
                      <Checkbox
                        checked={checkboxValues.checkbox1}
                        onChange={handleCheckboxChange}
                        name="checkbox1"
                      />
                    }
                    label="[필수] 서비스 이용약관에 동의합니다."
                  />
                  <T className="DetailText">자세히보기</T>
                </Box>

                <FormControlLabel
                  className="Agree"
                  control={
                    <Checkbox
                      checked={checkboxValues.checkbox2}
                      onChange={handleCheckboxChange}
                      name="checkbox2"
                    />
                  }
                  label="[필수] 만 14세 이상입니다."
                />
                <Box className="DetailBox">
                  <FormControlLabel
                    className="Agree"
                    control={
                      <Checkbox
                        checked={checkboxValues.checkbox3}
                        onChange={handleCheckboxChange}
                        name="checkbox3"
                      />
                    }
                    label="[필수] 개인정보 수집 및 이용에 동의합니다."
                  />
                  <T className="DetailText">자세히보기</T>
                </Box>
                <Box className="DetailBox">
                  <FormControlLabel
                    className="Agree"
                    control={
                      <Checkbox
                        checked={checkboxValues.checkbox4}
                        onChange={handleCheckboxChange}
                        name="checkbox4"
                      />
                    }
                    label="[선택] 이벤트 및 혜택안내 개인정보 수집 · 이용에 동의합니다."
                  />
                  <T className="DetailText">자세히보기</T>
                </Box>

                <FormControlLabel
                  className="Agree2"
                  control={
                    <Checkbox
                      checked={checkboxValues.checkbox5}
                      onChange={handleCheckboxChange}
                      name="checkbox5"
                    />
                  }
                  label="[선택] 이메일 수신 동의"
                />
                <FormControlLabel
                  className="Agree2"
                  control={
                    <Checkbox
                      checked={checkboxValues.checkbox6}
                      onChange={handleCheckboxChange}
                      name="checkbox6"
                    />
                  }
                  label="[선택] SNS 수신 동의"
                />
              </FormGroup>
              <Button className="JoinButton" onClick={handleSubmit}>
                응모하기
              </Button>
            </Box>
          </Box>
        </Box>
        <img alt="mobileImg" className="MobileImg" src={images.Mreservation2} />
      </Box>
    </Container>
  );
};

export default Reservation;
