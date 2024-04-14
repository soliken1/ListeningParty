import { signOut } from "firebase/auth";
import { auth } from "../configs/configs";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    console.log(auth.currentUser?.email);
    navigate("/");
  };
  return (
    <>
      <div>Welcome!</div>
      <button onClick={logout}>Logout</button>
    </>
  );
}
export default Home;
