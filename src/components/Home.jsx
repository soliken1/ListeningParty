import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../configs/configs";
import { useNavigate, Link } from "react-router-dom";
import DefaultIcon from "../assets/user.png";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { useEffect } from "react";

function Home({ data }) {
  const navigate = useNavigate();
  const isHomePage = window.location.pathname === "/Home";

  const [roomList, setRoomList] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [state, setState] = useState(true);

  useEffect(() => {
    const getRoomList = async () => {
      try {
        const roomCollectionRef = collection(db, "music-room");
        const roomSnapshot = await getDocs(roomCollectionRef);
        const roomsData = roomSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoomList(roomsData);
      } catch (error) {
        console.error("Error getting room list: ", error);
      }
    };
    getRoomList();
  }, []);

  const onCreateRoom = async () => {
    try {
      const roomCollectionRef = collection(db, "music-room");
      const timestamp = serverTimestamp();
      await addDoc(roomCollectionRef, {
        room_name: name,
        room_desc: desc,
        room_created: timestamp,
        state: state,
        userId: auth?.currentUser?.uid,
      });

      const roomSnapshot = await getDocs(roomCollectionRef);
      const roomsData = roomSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRoomList(roomsData);
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      <header>
        <div className="user-details mt-sm-5">
          {data && data.photoURL ? (
            <img className="user-pfp" src={data.photoURL} alt="User Profile" />
          ) : (
            <img className="user-pfp" src={DefaultIcon} alt="Custom Image" />
          )}
          <label className="font-primary white-color font-size-subheader ms-2">
            {data && data.displayName
              ? data.displayName
              : data && data.email && data.email.split("@")[0]}
          </label>
        </div>
        <nav className="nav-bar">
          <ul>
            <li>
              <Link to="/Home" className={isHomePage ? "active" : ""}>
                Room List
              </Link>
            </li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="home-layer">
        <label className="font-primary white-color font-size-subheader">
          Create a New Room
        </label>
        <div className="mt-2">
          <input
            type="text"
            className="input-textbox me-1"
            placeholder="Room Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input-textbox me-1"
            placeholder="Room Description"
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            type="text"
            hidden
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <button onClick={onCreateRoom} className="create-btn">
            Create
          </button>
        </div>
        <div className="room-body">
          {roomList.map((room) => (
            <Link
              className="room-cards t-deco-none black-color"
              to={`/Room/${room.id}`}
              key={room.id}
            >
              <label
                style={{ color: room.state ? "green" : "red" }}
                className="font-primary"
              >
                {room.room_name}
              </label>
              <label className="font-primary white-color">
                {room.room_desc}
              </label>
              <label className="font-primary white-color">
                {new Date(room.room_created.seconds * 1000).toLocaleString()}
              </label>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
