import "./App.css";

function App() {
  return (
    <>
      <div className="registrationCard">
        <div className="heading">
          <h1>Welcome Back</h1>
          <p>
            Track your health with <span className="topic">MedValut</span>
          </p>
        </div>

        <form action="" method="get" className="form">
          <label htmlFor="">Role</label> <br />
          <select name="" id="">
            <option value="nurse">Nurse</option>
            <option value="Doctor">Doctor</option>
            <option value="Admin">Admin</option>
            <option value="Paitent">Paitent</option>
          </select>
          <br />
          <label htmlFor="">Email</label> <br />
          <input type="text" /> <br />
          <label htmlFor="">Password</label> <br />
          <input type="password" /> <br />
          <a href="" className="forgetP">
            Forget Password
          </a>{" "}
          <br />
          <button className="rButn">Sign in</button>
          <p className="newAccLink">
            New to Medvalut ?
            <span>
              <a href="">Create Account</a>
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default App;
