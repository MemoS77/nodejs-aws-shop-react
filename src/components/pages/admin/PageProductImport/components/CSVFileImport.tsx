import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosRequestHeaders } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    try {
      console.log("real uploadFile to", url);
      if (!file) {
        console.log("no file");
        return;
      }

      const token = localStorage.getItem("authorization_token");
      const headers: AxiosRequestHeaders = token
        ? { Authorization: `Basic ${token}` }
        : {};

      let response;

      response = await axios({
        method: "GET",
        url,
        headers,
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      if (response) {
        console.log("File to upload: ", file.name);
        const sUrl = response.data.signedUrl;
        console.log("Uploading to: ", sUrl);
        const result = await fetch(sUrl, {
          method: "PUT",
          body: file,
        });
        console.log("Result: ", result);
        setFile(undefined);
      }
    } catch (error) {
      // Get Code error
      console.log("Error while file upload!", error);
      throw error;
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
