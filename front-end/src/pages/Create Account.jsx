import React from "react";

function CreateAccount() {
  return (
    <div>
      <div className="logInCard">
        <h1>Create Account</h1>
        <p>Enter your details</p>
        <div className="formContainer">
          <form action="" className="logInForm">
            <label htmlFor="">First Name</label> <br />
            <input type="text" placeholder="Enter your first name" /> <br />
            <label htmlFor="">Last Name</label> <br />
            <input type="text" placeholder="Enter your last name" />
            <br />
            <label htmlFor="">Select your Role</label> <br />
            <select name="" id="roleSelection">
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Patient">Patient</option>
            </select>
            <br />
            <a href="#" className="passwordReset">
              Forget Password
            </a>
            <br />
            <button className="signInBtn">Next</button>
            <p className="createAcc">
              Already have account? <a href="#">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
