import { auth, googleProvider } from "../configs/configs.js";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../assets/google.png";
import MailIcon from "../assets/email.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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

  const redirectLogin = () => {
    navigate("/");
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/Home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="login-layer">
        <div className="card-form">
          <label className="font-primary white-color font-size-header mt-2">
            Listening <label className="black-bg white-color">Party</label>
          </label>
          <label className="font-primary white-color font-size-body font-size-subheader mt-2 mb-1">
            Register
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
          <button className="register-button" onClick={register}>
            <img className="btn-icons" src={MailIcon} />
            Register Via Mail
          </button>
          <button className="google-button" onClick={googleLogin}>
            <img className="btn-icons" src={GoogleIcon} />
            Sign In With Google
          </button>
          <label className="font-primary white-color font-size-body">
            Already Have An Account?{" "}
            <a
              className="t-deco-none red-color"
              href=""
              onClick={redirectLogin}
            >
              Login Here
            </a>
          </label>
        </div>
      </div>
    </>
  );
}

export default Register;
