// ** React Imports
import { useState } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

// Styled component for the upload image inside the dropzone area
const Img = styled("img")(({ theme }) => ({
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

const FileUploaderSingle = (props) => {
  const { onUpload, files, type, isColumn = false } = props;

  const acceptedTypeFile = { "image/*": [".png", ".jpg", ".jpeg"] };
  // ** Hook
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      ...acceptedTypeFile,
    },
    onDrop: (acceptedFiles) => {
      onUpload(acceptedFiles.map((file) => Object.assign(file)));
    },
  });

  const img = files.map((file) => (
    <img
      height={150}
      key={file.name}
      alt={file.name}
      className="single-file-image"
      src={URL.createObjectURL(file)}
    />
  ));

  return (
    <Box
      {...getRootProps({ className: "dropzone" })}
      sx={isColumn ? { textAlign: "center" } : {}}
    >
      <input {...getInputProps()} />
      {img}
      <Box
        sx={{
          display: isColumn ? "column" : "flex",
          flexDirection: ["column", "column", "row"],
          alignItems: "center",
        }}
      >
        <>
          <Img
            alt="Upload Image"
            src="/images/misc/upload.png"
            height={150}
            sx={isColumn ? { margin: "0 auto" } : {}}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: ["center", "center", "inherit"],
            }}
          >
            <HeadingTypography variant="h5">
              Masukan file di sini atau klik untuk mengunggah.
            </HeadingTypography>
            <Typography color="textSecondary">
              Allowed{" "}
              {acceptedTypeFile?.[`${type}/*`]?.map((item) => (
                <> *{item},</>
              ))}
            </Typography>
          </Box>
        </>
      </Box>
    </Box>
  );
};

export default FileUploaderSingle;
