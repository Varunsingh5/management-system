import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./component/Home";
import PhoneSignUp from "./component/PhoneSignUp";
import ProtectedRoute from "./component/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Reset from "./component/Reset";
import Dashboard from './component/Dashboard';
import Contacts from "../src/component/Admin/Contacts"

function App() {

  // let val = localStorage.getItem("role");
  const [role, setRole] = useState("");

  useEffect(() => {
setRole(localStorage.getItem("role"))
  }, [ localStorage.getItem("role")]);
console.log("role=====>>>>",role);
  return (
    <Container style={{ width: "400px" }}>
      <Row>
        <Col>
        {/* <Contacts /> */}
          {/* <Header /> */}
          <UserAuthContextProvider>
            <Routes>
              {role == "user" ?
                <>
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />

                </>
                :
                <>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </>}
              <Route path="/" element={<PhoneSignUp />} />
              <Route path="/reset" element={<Reset />} />

            </Routes>
          </UserAuthContextProvider>
          {/* <Dashboard /> */}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
