import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "shards-react";


const Main = ({ peer, conn }) => {

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [mystream, setMytream] = useState();

  const myVideo = useRef();

  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

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
  }, []);

  return (
    <div className="container-fluid">
      <Row>
        <Col style={{ padding: "0" }}>
          <video
            playsInline
            muted
            ref={myVideo}
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
            }}
          />

          <div style={{ padding: "0" }} className="text-center">
            <h3>
                MIC
            </h3>
          </div>
        </Col>
        <Col
          style={{
            padding: "0",
            borderLeft: "1px solid #2F4F4F",
            height: `${height}px`,
          }}
        ></Col>
      </Row>
    </div>
  );
};

export default Main;
