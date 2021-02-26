import React from 'react'
import {
    Row,
    Col,
    Button,
  } from "shards-react";

export default function Message({messages}) {
    return (
        <Row>
            {messages &&
                  messages.map((message, index) => (
                    <Col
                      key={index}
                      md="12"
                      className={message.owner ? "text-right" : "text-left"}
                    >
                      <Button
                        outline
                        pill
                        theme={message.owner ? "primary" : "secondary"}
                        className="mb-1"
                      >
                        {" "}
                        {message.message}{" "}
                      </Button>
                    </Col>
                  ))}
        </Row>
    )
}
