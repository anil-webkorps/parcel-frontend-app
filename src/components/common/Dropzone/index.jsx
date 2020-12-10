import React, { useCallback } from "react";
import csv from "csv";
import { useDropzone } from "react-dropzone";

import { Container } from "./styles";

export default function Basic(props) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      const reader = new FileReader();
      reader.onload = () => {
        csv.parse(reader.result, (err, data) => {
          props.onDrop(data.slice(1));
        });
      };

      reader.readAsBinaryString(acceptedFiles[0]);
    },
    [props]
  );

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ maxFiles: 1, accept: ".csv", onDrop });

  const files = acceptedFiles.map((file) => (
    <span key={file.path}>
      {file.path} - {file.size} bytes
    </span>
  ));

  return (
    <section>
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        style={props.style}
      >
        <input {...getInputProps()} />
        {files && files.length > 0 ? (
          <div className="text-center">Uploaded Successfully - {files}</div>
        ) : (
          <p className="text-center">
            Drag and drop a .csv file here, or click here to select a file
          </p>
        )}
      </Container>
    </section>
  );
}
