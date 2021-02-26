import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "shards-react";
import "firebase/firestore";
import firebase from "../firebase/";

const SignIn = ({ toggleSign, setID }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleSignIn = firebase
      .firestore()
      .collection("users")
      .onSnapshot((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(newData);
      });

    return () => handleSignIn;
  }, [setUsers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(email === "") && !(password === "") && password.length >= 6) {
      let err = false;
      users.forEach(function (user) {
        if (email === user.email && password === user.password) {
          setID(user.id);
          localStorage.setItem("id", user.id);
          localStorage.setItem("fname", user.firstname);
          localStorage.setItem("lname", user.lastname);
          localStorage.setItem("email", user.email);
          err = true;
        }
      });

      if (err === false) {
        alert("email or password invalid");
      }
    }
  };

  return (
    <div className="App">
      <Card style={{ maxWidth: "400px", margin: "auto" }} className="mt-5">
        <CardHeader className="h4">Sign In</CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody>
            <div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
              <p
                className="mt-3 mb-0"
                style={{ padding: "0", cursor: "pointer" }}
                onClick={toggleSign}
              >
                Create Account?
              </p>
            </div>
          </CardBody>
          <CardFooter className="text-right">
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
