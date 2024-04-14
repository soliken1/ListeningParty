import { auth, googleProvider } from "../configs/configs.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../assets/google.png";
import MailIcon from "../assets/email.png";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
      navigate("/Home");
    } catch (err) {
      setErrorMessage(null);
      if (err.code === "auth/email-already-in-use") {
        setErrorMessage("Email already in use");
      } else if (err.code === "auth/missing-password") {
        setErrorMessage("Password is Empty");
      } else if (err.code === "auth/missing-email") {
        setErrorMessage("Email is Empty");
      } else {
        setErrorMessage("Please Input Appropriate Fields");
      }
      console.log(err);
    }
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
      navigate("/Home");
    } catch (err) {
      console.log(err);
    }
  };

  const redirectRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <div className="login-layer">
        <div className="card-form">
          <label className="font-primary white-color font-size-header mt-2">
            Listening <label className="black-bg white-color">Party</label>
          </label>
          <label className="font-primary white-color font-size-body font-size-subheader mt-2 mb-1">
            Login
          </label>
          <input
            className="input-textbox"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-textbox"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && (
            <label className="font-primary red-color font-size-body">
              {errorMessage}
            </label>
          )}
          <button className="login-button" onClick={login}>
            <img className="btn-icons" src={MailIcon} />
            Login Via Mail
          </button>
          <button className="google-button" onClick={googleLogin}>
            <img className="btn-icons" src={GoogleIcon} />
            Sign In With Google
          </button>
          <label className="font-primary white-color font-size-body">
            No Account?{" "}
            <a
              className="t-deco-none red-color"
              href=""
              onClick={redirectRegister}
            >
              Register Here
            </a>
          </label>
        </div>
      </div>
    </>
  );
}

export default Login;
