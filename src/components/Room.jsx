import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../configs/configs";
import { useParams } from "react-router-dom";
import {
  collection,
  serverTimestamp,
  addDoc,
  query,
  where,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import youtube from "../api/youtube.js";
import Header from "./Header";

function Room({ data }) {
  const { session_id } = useParams();
  const isHomePage = window.location.pathname === "/Home";

  const [session, setSession] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibility, setVisibility] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isNavActive, setIsNavActive] = useState(false);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  const searchSong = async () => {
    try {
      const response = await youtube.get("/search", {
        params: {
          q: search,
        },
      });
      if (response.data.items && response.data.items.length > 0) {
        setSearchResults(response.data.items);
        console.log(response.data.items);
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      if (error.request.status == 403) {
        console.error("Error finding song: ", error.request.response);
        setErrorMessage("Youtube Quota Reached :( Come Back Tomorrow!");
      } else {
        console.error("Error finding song: ", error);
      }
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    searchSong();
  };

  const handleHideFooter = () => {
    setVisibility(!visibility);
  };

  const handleVideoSelect = async (video) => {
    try {
      await setDoc(doc(db, "current_playing", session_id), {
        selectedVideo: video,
        userId: auth?.currentUser?.uid,
      });
    } catch (error) {
      console.error("Error selecting video: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "current_playing", session_id),
      (doc) => {
        if (doc.exists()) {
          const roomData = doc.data();
          setSelectedVideo(roomData.selectedVideo);
        }
      }
    );

    return () => unsubscribe();
  }, [session_id]);

  useEffect(() => {
    const sessionCollectionRef = collection(db, "session");
    const q = query(sessionCollectionRef, where("room_id", "==", session_id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSession(messages);
    });

    return () => unsubscribe();
  }, [session_id]);

  const onCreateMessage = async () => {
    try {
      const addUser =
        data && data.displayName
          ? data.displayName
          : data && data.email && data.email.split("@")[0];

      await addDoc(collection(db, "session"), {
        room_id: session_id,
        sender_message: message,
        sender_created: serverTimestamp(),
        userId: auth?.currentUser?.uid,
        sender_user: addUser,
      });
      setMessage("");
    } catch (error) {
      console.error("Error adding document: ", error);
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
      <div className="wrapper mt-4">
        <div className="side">
          <div className="session-body">
            {session
              .filter((session) => session.sender_created !== null)
              .sort(
                (a, b) => a.sender_created.seconds - b.sender_created.seconds
              )
              .map((session) => (
                <div key={session.id}>
                  <div className="session">
                    <label className="font-primary white-color font-size-body">
                      {session.sender_created
                        ? new Date(
                            session.sender_created.seconds * 1000
                          ).toLocaleString()
                        : ""}
                    </label>
                    <label className="font-primary white-color font-size-body">
                      {session.sender_user}
                    </label>
                    <label className="font-primary white-color font-size-body">
                      {session.sender_message}
                    </label>
                  </div>
                </div>
              ))}
          </div>
          <div>
            <input
              type="text"
              className="send-txt-box mt-1 me-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message Here"
            />
            <button className="send-btn" onClick={onCreateMessage}>
              Send
            </button>
          </div>
        </div>
        <div className="main">
          <div className="session-body">
            {selectedVideo && (
              <div className="current-playing">
                <label className="white-color text-center font-primary font-size-subheader">
                  {selectedVideo.snippet.title}
                </label>
                <label className="white-color text-center font-primary font-size-body mb-2">
                  {selectedVideo.snippet.description}
                </label>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          {errorMessage && (
            <label className="font-primary red-color font-size-body">
              {errorMessage}
            </label>
          )}
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="send-txt-box mt-1 me-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Song Here"
            />
            <button className="send-btn me-1" onClick={searchSong}>
              Search
            </button>
            <button className="toggle-footer" onClick={handleHideFooter}>
              {visibility ? "Hide Result" : "Show Result"}
            </button>
          </form>
        </div>
        {visibility && (
          <div className="footer">
            {searchResults &&
              searchResults.map((video) => (
                <div
                  className="footer-cards"
                  key={video.id.videoId}
                  onClick={() => handleVideoSelect(video)}
                >
                  <label className="font-primary white-color mb-2">
                    {video.snippet.title}
                  </label>
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Room;
