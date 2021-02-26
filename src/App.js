import React, { useState } from "react";
import SignIn from "./component/SignIn";
import SignUp from "./component/SignUp";
import Setup from "./component/Setup";

const App = () => {
  const [signIn, setSignIn] = useState(false);
  const [id, setID] = useState("");

  const toggleSign = () => {
    setSignIn(signIn ? false : true);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload(false);
  };

  return (
    <div className="App">
      {localStorage.getItem("id") ? (
        <Setup logout={logout} />
      ) : signIn ? (
        <SignUp toggleSign={toggleSign} setID={setID} />
      ) : (
        <SignIn toggleSign={toggleSign} setID={setID} />
      )}
    </div>
  );
};

export default App;
