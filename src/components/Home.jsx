import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../configs/configs";
import { useNavigate } from "react-router-dom";
import DefaultIcon from "../assets/user.png";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { useEffect } from "react";

function Home({ data }) {
  const navigate = useNavigate();

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
      <div className="header">
        <div className="user-details mt-1">
          {data && data.photoURL ? (
            <img className="user-pfp" src={data.photoURL} alt="User Profile" />
          ) : (
            <img className="user-pfp" src={DefaultIcon} alt="Custom Image" />
          )}
          <label className="font-primary font-size-subheader ms-2">
            {data && data.displayName
              ? data.displayName
              : data && data.email && data.email.split("@")[0]}
          </label>
        </div>
        <label id="welcome-label" className="font-primary font-size-subheader">
          Welcome! Select A Room
        </label>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="home-layer">
        <label className="font-primary font-size-subheader">
          Create a New Room Instead!
        </label>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Room Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
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
            Create Room
          </button>
        </div>
        <div className="room-body">
          {roomList.map((room) => (
            <div key={room.id} className="room-cards">
              <label
                style={{ color: room.state ? "green" : "red" }}
                className="font-primary"
              >
                {room.room_name}
              </label>
              <label className="font-primary">{room.room_desc}</label>
              <label className="font-primary">
                {new Date(room.room_created.seconds * 1000).toLocaleString()}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
