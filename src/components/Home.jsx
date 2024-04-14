import { signOut } from "firebase/auth";
import { auth } from "../configs/configs";
import { useNavigate } from "react-router-dom";
import DefaultIcon from "../assets/user.png";

function Home({ data }) {
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  console.log(data);

  return (
    <>
      <div className="header">
        {data && data.photoURL ? (
          <img className="user-pfp" src={data.photoURL} alt="User Profile" />
        ) : (
          <img className="user-pfp" src={DefaultIcon} alt="Custom Image" />
        )}{" "}
        <label className="font-primary font-size-body ms-2">
          {data && data.displayName
            ? data.displayName
            : data && data.email && data.email.split("@")[0]}
        </label>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="home-layer">
        <label className="font-primary font-size-subheader">
          Welcome! Select A Room
        </label>
        <div className="room-body"></div>
        <label className="font-primary font-size-body">
          Create A Room Instead!
        </label>
      </div>
    </>
  );
}
export default Home;
