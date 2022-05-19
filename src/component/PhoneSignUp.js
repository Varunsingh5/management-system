/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useUserAuth } from "../context/UserAuthContext";
// import TextField from '@mui/material/TextField';
// import { navigate } from "react-router-dom";
import { logInWithEmailAndPassword, db } from "../firebase";
import { query, collection, getDocs, where, addDoc,doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInWithPhoneNumber, } from "firebase/auth";
import moment from "moment";


const PhoneSignUp = () => {
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [value, setValue] = useState(false);
  const { setUpRecaptha } = useUserAuth();

  //admin pannel email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationState, setValidationState] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate();

  const validation = (key, value) => {
    let isvalid = false;
    let result;
    switch (key) {
      case 'email':
        result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isvalid = value ? result.test(value) : true;
        break;
      case 'password':
        result = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/;
        isvalid = value ? result.test(value) : true;
        break;
      default:
        break;
    }
    console.log("asdgjvaghscdvhas", isvalid);
    return isvalid;
  }
  const Login = () => {
    if (!email)
      setValidationState({ ...validationState, email: "Please enter valid email" })
    else {
      if (!password)
        setValidationState({ ...validationState, password: "Please enter your Password" })
      else {
        logInWithEmailAndPassword(email, password, navigate);
      }
    }
  };

  const getOtp = async (e) => {
    e.preventDefault();
    console.log(number);
    setError("");
    if (number === "" || number === undefined)
      return setError("Please enter a valid phone number!");
    try {
      const response = await setUpRecaptha(number);
      setResult(response);
      setFlag(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp === "" || otp === null) return;
    try {
      console.log("result", result);
      await result.confirm(otp)
        .then(async (confirmationResult) => {
          console.log("jdvfsdnhfjdshi", confirmationResult);
          localStorage.setItem('isAuth', 'true')
          localStorage.setItem('user', JSON.stringify(confirmationResult?.user))
          localStorage.setItem('role', "user");
          console.log("SSzfasfas",confirmationResult?.user);

          const docRef = doc(db, "users",confirmationResult?.user?.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            localStorage.setItem('role', docSnap.data().role);
            // if (docSnap.data().role == "user") {
              navigate("/home")
            // }
          }
          else{
            await setDoc(docRef, {
              uid: confirmationResult?.user?.uid,
              name:"",
              authProvider:confirmationResult?. providerId,
              email:"",
              onlineState: "",
              role: "user",
              isVerified:false,
              created_at:moment.now()
            })
            .then((e)=>{
              navigate("/home")
            })
            .catch(error=>console.log("error on doc craete phone signup",error))
          }
        })
        .catch(async(err)=>{
         console.log("error in confirm otp",err);
        })
    } catch (err) {
      setError(err.message);
    }
  };


  const fetchUserName = async (user) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      return ({ user })
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-4 box">
        <div className='img1' >
          <img style={{ height: "85%", width: "65%", marginLeft: "52px", }} src="https://scontent.fixc1-4.fna.fbcdn.net/v/t1.6435-9/116801322_2910579749202572_600578605717691205_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=vy9z4pYMZcwAX-dHDGx&_nc_ht=scontent.fixc1-4.fna&oh=00_AT9Z0kRrQTYWGYJsBshLmqwPzufcJR1_CYm4IAvIJX8vBw&oe=62856005" />
        </div>
        {!value ?
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={getOtp} style={{ display: !flag ? "block" : "none" }}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <PhoneInput
                  defaultCountry="IN"
                  value={number}
                  onChange={setNumber}
                  placeholder="Enter Phone Number"
                  phoneNumber
                // getPhoneNumberFromUserInput
                />
                <div id="recaptcha-container"></div>
              </Form.Group>
              <div className="button-right">
                <Link to="/">
                  <Button variant="secondary">Cancel</Button>
                </Link>
                &nbsp;
                <Button type="submit" variant="primary">
                  Send Otp
                </Button>
              </div>
              <p style={{ textAlign: "center", marginTop: "20px" }} onClick={() => setValue(true)} >
                Copyright © 2021 squadminds, Mohali.
              </p>
            </Form>
            <Form onSubmit={verifyOtp} style={{ display: flag ? "block" : "none" }}>
              <Form.Group className="mb-3" controlId="formBasicOtp">
                <Form.Control
                  type="otp"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
              <div className="button-right">
                <Link to="/">
                  <Button variant="secondary">Cancel</Button>
                </Link>
                &nbsp;
                <Button type="submit" variant="primary">
                  Verify
                </Button>
              </div>
            </Form>
          </>
          : <>
            <div className="login">
              <div className="login__container">
                <input
                  type="text"
                  className="login__textBox"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setValidationState({ ...validationState, email: "" })

                  }}
                  placeholder="E-mail Address"
                  required
                />
                <span>{validationState?.email}</span>
                <input style={{ marginTop: "15px" }}
                  type="password"
                  className="login__textBox"
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setValidationState({ ...validationState, password: "" })
                  }}
                  placeholder="Password"
                  required
                />
                <span>{validationState?.password}</span>
                <div>
                  <Button style={{ marginTop: "15px", marginLeft: "70px" }} variant="primary" className="login__btn" onClick={Login}>
                    Login
                  </Button>
                </div>
                <div style={{ marginLeft: "50px", marginTop: '5px' }}>
                  <Link to="/reset">Forgot Password</Link>
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </>
  );
};

export default PhoneSignUp;