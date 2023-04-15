import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useSignOut } from "../../hooks/useSignOut";

// styles
import "./Home.css";
import avatar from "./avatar.jpg";

export default function Home() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const { signout } = useSignOut();
  const { document: userDoc } = useDocument("users", user && user.uid);
  const { conversations } = userDoc ?? {};

  // redirect user to sign in page if not signed in
  useEffect(() => {
    if (!user) {
      nav("/signin");
    }
  }, [user, nav]);

  return (
    <div className="home container">
      <nav>
        <button className="btn signout" onClick={signout}>
          sign out
        </button>
      </nav>
      <main>
        <h1>Select A Conversation:</h1>
        <div className="conversations">
          {conversations
            ? conversations.map(({ id, name, profilePhoto }) => (
                <Link
                  className="conversation"
                  key={id}
                  to={`/conversations/${id}`}
                >
                  <img src={profilePhoto || avatar} alt="" />
                  <p className="name">{name}</p>
                </Link>
              ))
            : null}
          <Link className="conversation" to="/create">
            <i className="fa-solid fa-plus"></i>
            <p>New Conversation</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
