import React from "react";

export default function InputFile({ files, setFiles, sendFile}) {
  return (
    <div>
      <div className="input-group mb-3 mt-3">
        <input
          type="file"
          className="form-control"
          placeholder="Message"
          aria-describedby="button-addon2"
          onChange={(e) => setFiles(e.target.files)}
        />
        <button
          className="btn btn-primary"
          type="button"
          id="button-addon2"
          disabled={files ? false : true}
          onClick={sendFile}
        >
          Send
        </button>
      </div>
    </div>
  );
}
