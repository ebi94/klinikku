// ** React Imports
import { useEffect, useState } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";

// Styled component for the upload image inside the dropzone area
const Img = styled("img")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    marginRight: theme.spacing(15.75),
  },
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    width: 160,
  },
}));

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(4),
  },
}));

const FileUploaderSimple = (props) => {
  const { file, onSetFile } = props;
  // ** State
  const [files, setFiles] = useState([]);

  // ** Hook
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
      onSetFile(acceptedFiles.map((file) => Object.assign(file)));
    },
  });

  const img = files.map((file) => (
    <>
      <img
        key={file.name}
        alt={file.name}
        className="single-file-image"
        src={URL.createObjectURL(file)}
      />
    </>
  ));

  useEffect(() => {
    setFiles(file);
  }, [file]);

  return (
    <Box
      {...getRootProps({ className: "dropzone" })}
      sx={files.length ? { height: 150 } : { height: 150 }}
    >
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Icon
              icon="mdi:camera"
              fontSize={40}
              style={{ margin: "0 auto" }}
            />
            <Typography color="textSecondary">
              Masukan file di sini atau klik untuk memfoto.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUploaderSimple;
