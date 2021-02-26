import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import Message from "./Message";
import InputMessage from "./InputMessage";
import InputFile from "./InputFile";
import RenderFile from "./RenderFile";
import { Row, Col, ButtonGroup, Button, Badge, FormInput } from "shards-react";
import { Modal } from "react-bootstrap";

var peer = new Peer(localStorage.getItem("id"));
var conn = peer.connect();

const Setup = ({ logout }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [friendID, setFriendID] = useState("");
  const [start, setStart] = useState(false);
  const [mystream, setMytream] = useState();
  const [txtMessage, setTxtMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [btnChat, setBtnChat] = useState(true);
  const [files, setFiles] = useState();
  const [fileList, setFileList] = useState([]);
  const [mic, setMic] = useState(false);
  const [audio, setAudio] = useState(false);
  const [modal, setModal] = useState(true);

  const myVideo = useRef();
  const friendVideo = useRef();

  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const reloadPage = () => {
    if (!localStorage.getItem("reload")) {
      localStorage.setItem("reload", true);
      window.location.reload(false);
    }
  };

  // reload page once for set PeerID
  reloadPage();

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMytream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    peer.on("connection", (connection) => {
      conn = connection;

      // Receive Data
      connection.on("data", (data) => {
        setStart(true);
        handleClose();

        if (data.type === "id") {
          setFriendID(data.id);
          conn.send({ type: "id", id: localStorage.getItem("id") });
        }
        if (data.type === "message") onReceivedMessage(data);
        if (data.type === "file") onReceivedFile(data);
      });
    });

    // Answer
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          call.on("stream", (stream) => {
            friendVideo.current.srcObject = stream;
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    });
  }, []);

  const startConnection = () => {
    if (friendID.length > 10) {
      conn = peer.connect(friendID);
      conn.on("open", () => {
        conn.send({ type: "id", id: localStorage.getItem("id") });
        setStart(true);
        handleClose();
      });

      conn.on("data", (data) => {
        if (data.type === "id") setFriendID(data.id);
        if (data.type === "message") onReceivedMessage(data);
        if (data.type === "file") onReceivedFile(data);
      });

      // Call
      let call = peer.call(friendID, mystream);
      call.on("stream", (stream) => {
        friendVideo.current.srcObject = stream;
      });
    }
  };

  const sendMessage = () => {
    if (txtMessage) {
      conn.send({ type: "message", message: txtMessage });
      setMessages((messages) => [
        ...messages,
        { message: txtMessage, owner: true },
      ]);
      setTxtMessage("");
    }
  };

  const onReceivedMessage = (data) => {
    setMessages((messages) => [
      ...messages,
      { message: data.message, owner: false },
    ]);
  };

  const sendFile = () => {
    const file = files[0];

    try {
      if (file.size >= 5242880) {
        const blob = new Blob(files, { type: file.type });

        conn.send({
          type: "file",
          file: blob,
          filename: file.name,
          filetype: file.type,
          size: file.size,
        });
      } else {
        alert("The file is less than 5 MB.");
      }
      setFiles("");
    } catch (err) {
      alert(err);
      setFiles("");
    }
  };

  const onReceivedFile = (data) => {
    const blob = new Blob([data.file], { type: data.filetype });
    const url = URL.createObjectURL(blob);

    addFile({ name: data.filename, url: url, size: data.size });
  };

  const addFile = (file) => {
    const data = { name: file.name, url: file.url, size: file.size };
    setFileList((fileList) => [...fileList, data]);
  };

  const toggleBtnChat = () => {
    setBtnChat(btnChat ? false : true);
  };

  const toggleMic = () => {
    setMic(mic ? false : true);
  };

  const toggleAudio = () => {
    setAudio(audio ? false : true);
  };

  const handleClose = () => setModal(false);

  return (
    <div className="container-fluid">
      <Row>
        <Col style={{ padding: "0" }}>
          <video
            playsInline
            muted
            ref={friendVideo}
            autoPlay
            style={{
              width: `${width - 450}px`,
              height: `${height - 100}px`,
              background: "#2F4F4F",
            }}
          />

          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{
              maxWidth: `${300}px`,
              position: "relative",
              bottom: `${height - 100}px`,
              right: `-${width - 760}px`,
              //   zIndex:"9999",
              marginBottom: "-200px",
              borderRadius: ".625rem",
              boxShadow:
                "0 0.46875rem 2.1875rem rgb(90 97 105 / 10%), 0 0.9375rem 1.40625rem rgb(90 97 105 / 10%), 0 0.25rem 0.53125rem rgb(90 97 105 / 12%), 0 0.125rem 0.1875rem rgb(90 97 105 / 10%)",
            }}
          />

          <div
            style={{ padding: "0" }}
            className="d-flex justify-content-center"
          >
            <div className="mr-5">
              <h3 className="mb-0">
                <i
                  style={{ cursor: "pointer", color: "green" }}
                  className={mic ? "bi bi-mic-mute-fill" : "bi bi-mic"}
                  onClick={() => toggleMic()}
                ></i>
              </h3>
            </div>
            <div>
              <h3 className="mb-0 ml-2">
                <i
                  style={{ cursor: "pointer", color: "green" }}
                  className={
                    audio ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill"
                  }
                  onClick={() => toggleAudio()}
                ></i>
              </h3>
            </div>
          </div>
        </Col>
        <Col
          style={{
            borderLeft: "1px solid #2F4F4F",
            height: `${height}px`,
          }}
        >
          <ButtonGroup className="mb-2 mt-2" style={{ width: "100%" }}>
            <Button
              outline
              disabled={btnChat ? true : false}
              onClick={() => toggleBtnChat()}
            >
              Chat
            </Button>
            <Button
              outline
              disabled={btnChat ? false : true}
              onClick={() => toggleBtnChat()}
            >
              File
            </Button>
            <Button outline theme="danger" onClick={() => logout()}>
              Logout
            </Button>
          </ButtonGroup>

          <div
            className="mt-3 mb-3"
            style={{
              height: `${height - 150}px`,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {btnChat ? (
              <Message messages={messages} />
            ) : (
              <RenderFile fileList={fileList} />
            )}
          </div>

          {btnChat ? (
            <InputMessage
              txtMessage={txtMessage}
              setTxtMessage={setTxtMessage}
              sendMessage={sendMessage}
            />
          ) : (
            <InputFile files={files} setFiles={setFiles} sendFile={sendFile} />
          )}
        </Col>
      </Row>

      <Modal show={modal} backdrop="static" keyboard={false} id="start">
        <Modal.Body>
          <h4 className="mb-4">
            <Badge className="mr-2">MyID</Badge>
            {localStorage.getItem("id")}
          </h4>
          <FormInput
            placeholder="Enter Your Friend ID"
            value={friendID}
            onChange={(e) => setFriendID(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button theme="success" onClick={() => startConnection()}>
              Connect
            </Button>
            <Button theme="danger" onClick={() => logout()}>
              Logout
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Setup;
