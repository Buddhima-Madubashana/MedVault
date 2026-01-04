import "../styles/Login.css";

function Login() {
  return (
    <div className="body">
      <div className="topBar">
        <img src="public\Logo.png" alt="Logo " className="logo" />
        <button className="signIn">Sign up / Log in</button>
      </div>

      <div className="signInSection">
        <div className="details">
          <h1 className="mainTopic">MedVault</h1>
          <p className="subHeading">Secure Patient data Management System</p>
          <button className="signIn2">Get Started</button>
        </div>

        <div className="image">
          <img src="public\Log_in_page_image.png" />
        </div>
      </div>
    </div>
  );
}

export default Login;
