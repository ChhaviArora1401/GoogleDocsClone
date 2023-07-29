import { useEffect } from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import Nav from "./Navbar";

export default function Login({ user, setUser }) {
  let navigate = useNavigate();
  let auth = getAuth();
  let googleProvider = new GoogleAuthProvider();
  const signIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        console.log(res.user);
        setUser({
          name: res.user.displayName,
          email: res.user.email,
          icon: res.user.photoURL
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.user.displayName,
            email: res.user.email,
            icon: res.user.photoURL
          })
        );
      })
      .catch((error) => {
        // console.log(error);
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (response) => {
      if (response) {
        navigate("/home");
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <>
      <Nav>
        <button onClick={signIn} className="signInBtn">
          Sign In
        </button>
      </Nav>
      <div className="google-btn flex-col gap-20">
        <h2>Welcome</h2>
        <h1 className="width-60">
          Create and share documents with your friends in real-time.
        </h1>
        <h3>Login with your account</h3>
        <GoogleButton onClick={signIn} />
      </div>
    </>
  );
}
