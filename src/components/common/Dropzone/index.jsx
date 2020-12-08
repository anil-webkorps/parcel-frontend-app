import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "./styles";

export default function Basic(props) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      props.onDrop(acceptedFiles);
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
    <div key={file.path}>
      {file.path} - {file.size} bytes
    </div>
  ));

  return (
    <section className="container">
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input {...getInputProps()} />
        {files && files.length > 0 ? (
          <div>{files}</div>
        ) : (
          <p>Drag 'n' drop a .csv file here, or click to select file</p>
        )}
      </Container>
    </section>
  );
}
