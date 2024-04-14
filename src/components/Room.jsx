import DefaultIcon from "../assets/user.png";
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
  onSnapshot,
} from "firebase/firestore";

function Room({ data }) {
  const { session_id } = useParams();
  const [session, setSession] = useState([]);
  const [message, setMessage] = useState("");

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
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="session-layer debug">
        <div className="room-body debug">
          {session
            .filter((session) => session.sender_created !== null)
            .sort((a, b) => a.sender_created.seconds - b.sender_created.seconds)
            .map((session) => (
              <div key={session.id}>
                <div className="session">
                  <label className="font-primary font-size-body">
                    {session.sender_created
                      ? new Date(
                          session.sender_created.seconds * 1000
                        ).toLocaleString()
                      : ""}
                  </label>
                  <label className="font-primary font-size-body">
                    {session.sender_user}
                  </label>
                  <label className="font-primary font-size-body">
                    {session.sender_message}
                  </label>
                </div>
              </div>
            ))}
        </div>

        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message Here"
          />
          <button onClick={onCreateMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Room;
