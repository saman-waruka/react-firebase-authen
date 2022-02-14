import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { AuthContext } from "../../../AuthProvider";
import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithRedirect,
  AuthProvider,
} from "firebase/auth";
import { setDoc, getDoc, doc } from "firebase/firestore";

import { OAuthProvider } from "firebase/auth";

interface UserData {
  email: string;
  password: string;
}

const Login = () => {
  const authContext = useContext(AuthContext);
  const { loadingAuthState } = useContext(AuthContext);
  const history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: "",
  } as UserData);

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result || !result.user || !auth.currentUser) {
          return;
        }
   

        console.log("currentUser", auth.currentUser);
        console.log("idtoken", await auth.currentUser.getIdToken());

        // return setUserProfile().then(() => {
        redirectToTargetPage();
        // });
      })
      .catch((error) => {
        console.log("getRedirectResult error: ", error, "error");
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The credential that was used.
        const credential = OAuthProvider.credentialFromError(error);
        console.log("credential: ", credential);
        console.log("errorCode: ", errorCode);
        console.log("errorMessage: ", errorMessage);
        console.log("email: ", email);
      });
  }, []);

  const setUserProfile = async () => {
    if (await isUserExists()) {
      return;
    }

    const currentUser = auth.currentUser!;

    const docRef = doc(db, "Users");

    setDoc(docRef, {
      username: currentUser.displayName,
    })
      .then(() => {
        console.log("Saved");
        return;
      })
      .catch((error: any) => {
        console.log("setUserProfile error: ", error.message);
        alert(error.message);
      });

    // getDoc(docRef)
    // collection(db,"Users")
    // .doc(currentUser.uid)
    // .set({
    //     username: currentUser.displayName
    // })
    // .then(() => {
    //     console.log('Saved');
    //     return;
    // })
    // .catch((error: any ) => {
    //     console.log("setUserProfile error: ",error.message);
    //     alert(error.message);
    // })
  };

  const isUserExists = async () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const docRef = doc(db, "Users", auth.currentUser!.uid);

    const document = await getDoc(docRef);
    // db
    //     .collection("users")
    //     .doc(auth.currentUser!.uid)
    //     .get()
    //     console.log(" User exists")
    return document.exists;
  };

  const redirectToTargetPage = () => {
    history.push("/dashboard");
  };

  const handleClick = () => {
    history.push("/auth/signup");
  };

  const handleChange = (event: any) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((res) => {
        authContext.setUser(res);
        console.log(res, "res");
        history.push("/dashboard");
      })
      .catch((error) => {
        console.log("error: ", error.message);
        alert(error.message);
      });
  };

  const handleSocialClick = (sns: any) => {
    console.log(sns, "sns");

    let provider: AuthProvider;
    switch (sns) {
      case "Facebook":
        provider = new FacebookAuthProvider();
        console.log(provider, "fbprovider");
        break;

      case "Google":
        provider = new GoogleAuthProvider();
        console.log(provider, "gprovider");
        break;

      case "Twitter":
        provider = new TwitterAuthProvider();
        break;

      case "Apple":
        provider = new OAuthProvider("apple.com");
        break;

      default:
        throw new Error("Unsupported SNS" + sns);
    }

    signInWithRedirect(auth, provider).catch(handleAuthError);
  };

  const handleAuthError = (error: Error) => {
    console.log("handleAuthError: ", error);
  };

  if (loadingAuthState) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          value={values.email}
          placeholder="Enter your Email"
          onChange={handleChange}
        />
        <br />
        <br />
        <input
          type="password"
          name="password"
          value={values.password}
          placeholder="Enter your Password"
          onChange={handleChange}
        />
        <br />
        <br />
        <button>Login</button>
        <p>Not logged in yet?</p>
        <button onClick={handleClick}>SignUp</button> <br />
        <br />
      </form>

      <p>Social SignUp</p>
      <button onClick={() => handleSocialClick("Facebook")}>
        SignIn with Facebook
      </button>
      <br />
      <br />
      <button onClick={() => handleSocialClick("Google")}>
        SignIn with Google
      </button>
      <br />
      <br />
      <button onClick={() => handleSocialClick("Twitter")}>
        SignIn with Twitter
      </button>
      <br />
      <br />
      <button onClick={() => handleSocialClick("Apple")}>
        SignIn with AppleId
      </button>
      <br />
      <br />
    </div>
  );
};

export default Login;
