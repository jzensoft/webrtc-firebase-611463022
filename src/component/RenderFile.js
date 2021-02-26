import React from "react";
import prettyBytes from "pretty-bytes";

export default function RenderFile({fileList}) {
  return (
    <div>
      {fileList &&
        fileList.map((file, index) => (
          <ul className="list-group" key={index}>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <a href={file.url} download={file.name}>
                {file.name}
              </a>
              <span className="badge bg-primary rounded-pill">
                {prettyBytes(file.size)}
              </span>
            </li>
          </ul>
        ))}
    </div>
  );
}
