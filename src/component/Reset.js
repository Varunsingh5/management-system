/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { sendPasswordReset } from "../firebase"
import { Button } from "react-bootstrap";

function Reset() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    return (
        <div className="reset">
            <div className="reset__container">
                <div className='img1' >
                    <img style={{ height: "85%", width: "65%", marginLeft: "52px", }} src="https://scontent.fixc1-4.fna.fbcdn.net/v/t1.6435-9/116801322_2910579749202572_600578605717691205_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=vy9z4pYMZcwAX-dHDGx&_nc_ht=scontent.fixc1-4.fna&oh=00_AT9Z0kRrQTYWGYJsBshLmqwPzufcJR1_CYm4IAvIJX8vBw&oe=62856005" />
                </div>

                <input style={{ marginLeft: "40px" }}
                    type="text"
                    className="reset__textBox"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                />
                <div className="d-grid gap-2" style={{ marginTop: "20px", padding: "0px 88px 0px 65px" }}>
                    <Button variant="primary" className="reset__btn" onClick={() => sendPasswordReset(email, navigate)}>
                        Send password reset email
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default Reset;                           