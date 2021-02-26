import React, { useState } from "react";
import firebase from "../firebase/";
import "firebase/firestore";
import { Card, CardHeader, CardBody, CardFooter, Button } from "shards-react";

const SignUp = ({ toggleSign }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const saveDB = () => {
    const db = firebase.firestore();
    const todayDate = new Date().toISOString().slice(0, 10);

    db.collection("users")
      .add({
        firstname: `${fname}`,
        lastname: `${lname}`,
        email: `${email}`,
        password: `${password}`,
        created: `${todayDate}`,
      })
      .then(function (docRef) {
        // console.log("Document written with ID: ", docRef.id);
        alert('Please, Login Again')
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) {
      if (password.length >= 6) {
        if (password === cPassword) {
          //save user data
          saveDB();

          toggleSign()
          resetForm();
        } else {
          alert("Password is not math");
        }
      } else {
        alert("Password larger than 6 charater");
      }
    }
  };

  const resetForm = () => {
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
    setCPassword("");
  };

  return (
    <div className="App">
      <Card style={{ maxWidth: "480px", margin: "auto" }} className="mt-5">
        <CardHeader className="h4">Sign Up</CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody>
            <div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="fname"
                  placeholder="John"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                  autoFocus
                />
                <label htmlFor="fname">First Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="lname"
                  placeholder="name@example.com"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  required
                />
                <label htmlFor="lname">Last Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
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
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="ComfirnPassword"
                  placeholder="Password"
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                />
                <label htmlFor="ComfirnPassword">Comfirn Password</label>
              </div>
              <p
                className="mt-3 mb-0"
                style={{ padding: "0", cursor: "pointer" }}
                onClick={toggleSign}
              >
                Already Account?
              </p>
            </div>
          </CardBody>
          <CardFooter className="text-right">
            <Button type="submit">Save</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
