import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../configs/configs";
import { useNavigate, Link } from "react-router-dom";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { useEffect } from "react";
import Header from "./Header.jsx";
import Transparent from "../assets/Transparent.png";

function Home({ data }) {
  const navigate = useNavigate();
  const isHomePage = window.location.pathname === "/Home";

  const [roomList, setRoomList] = useState([]);
  const [currentPlay, setCurrentPlay] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [state, setState] = useState(true);

  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  useEffect(() => {
    const getCurrentPlay = async () => {
      try {
        const currentCollectionRef = collection(db, "current_playing");
        const currentSnapshot = await getDocs(currentCollectionRef);
        const currentData = currentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurrentPlay(currentData);
      } catch (error) {
        console.error("Error getting current playing: ", error);
      }
    };
    getCurrentPlay();
  }, []);

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
      <Header
        data={data}
        isHomePage={isHomePage}
        isNavActive={isNavActive}
        toggleNav={toggleNav}
        logout={logout}
      />
      <div className="home-layer">
        <label className="font-primary white-color font-size-subheader">
          Create a New Room
        </label>
        <div className="create-div mt-2">
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
          <button onClick={onCreateRoom} className="create-btn cursor-pointer">
            Create
          </button>
        </div>

        <div className="room-body">
          {roomList.map((room) => {
            const currentVideo = currentPlay.find(
              (video) => video.id === room.id
            );
            return (
              <Link
                className="room-cards t-deco-none white-color"
                to={`/Room/${room.id}`}
                key={room.id}
              >
                <div className="card-wrapper">
                  <div className="child-1">
                    <img
                      className="card-thumbnail"
                      src={
                        currentVideo?.selectedVideo.snippet.thumbnails.high.url
                          ? currentVideo?.selectedVideo.snippet.thumbnails.high
                              .url
                          : Transparent
                      }
                    />
                  </div>
                  <div className="child-2 mt-2">
                    <label className="font-primary font-bold font-size-subheader">
                      {room.room_name}
                    </label>
                    <label className="font-primary white-color">
                      {room.room_desc}
                    </label>
                    {currentVideo && (
                      <label className="text-center font-primary">
                        {currentVideo.selectedVideo?.snippet.title}
                      </label>
                    )}
                    <label className="font-primary gray-color font-size-body">
                      {new Date(
                        room.room_created.seconds * 1000
                      ).toLocaleString()}
                    </label>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Home;
