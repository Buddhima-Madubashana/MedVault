import React from "react";
import "../styles/Login.css";

function Login() {
  return (
    <div>
      <div className="logInCard">
        <h1>Welcome Back</h1>
        <p>
          Track your health with <b>Medvault</b>
        </p>
        <div className="formContainer">
          <form action="" className="logInForm">
            <label htmlFor="">Role</label> <br />
            <select name="" id="roleSelection">
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Patient">Patient</option>
            </select>
            <br />
            <label htmlFor="">Email</label> <br />
            <input type="email" placeholder="Enter your email" /> <br />
            <label htmlFor="">Password</label> <br />
            <input type="password" placeholder="Enter your password" />
            <br />
            <a href="#" className="passwordReset">
              Forget Password
            </a>
            <br />
            <button className="signInBtn">Sign In</button>
            <p className="createAcc">
              New to MedVault? <a href="#">Create Account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
