import React from "react";

export default function InputMessage({txtMessage, setTxtMessage, sendMessage}) {
  return (
    <div className="input-group mb-3 mt-3">
      <input
        type="text"
        className="form-control"
        placeholder="Message"
        aria-describedby="button-addon2"
        value={txtMessage}
        onChange={(e) => setTxtMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />
      <button
        className="btn btn-primary"
        type="button"
        id="button-addon2"
        onClick={() => sendMessage()}
        disabled={txtMessage ? false : true}
      >
        Send
      </button>
    </div>
  );
}
