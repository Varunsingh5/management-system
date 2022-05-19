import React from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Contacts from './Admin/Contacts';
// import Sidebar from "./Sidebar";
// import Mainbar from "./Mainbar"

const Dashboard = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };



  return (
    <div>  
      <Contacts />
      <div className="d-grid gap-2">
        <Button variant="primary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
        </div>
  )
}

export default Dashboard