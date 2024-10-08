// ** React Imports
import { Fragment, useState } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// ** Icon Imports
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

const FileUploaderMultiple = (props) => {
  const { onUpload, files = [] } = props;
  // ** State

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      onUpload(acceptedFiles.map((file) => Object.assign(file)));
    },
  });

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          width={38}
          height={38}
          alt={file.name}
          src={URL.createObjectURL(file)}
        />
      );
    } else {
      return <Icon icon="mdi:file-document-outline" />;
    }
  };

  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    onUpload([...filtered]);
  };

  const fileList = files.map((file) => (
    <ListItem key={file.name}>
      <div className="file-details">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <Typography className="file-name">{file.name}</Typography>
          <Typography className="file-size" variant="body2">
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon="mdi:close" fontSize={20} />
      </IconButton>
    </ListItem>
  ));

  const handleRemoveAllFiles = () => {
    onUpload([]);
  };

  return (
    <Fragment>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
        </Fragment>
      ) : (
        <Fragment>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <Box
              sx={{
                display: "flex",
                flexDirection: ["column", "column", "row"],
                alignItems: "center",
              }}
            >
              <Img alt="Upload img" src="/images/misc/upload.png" />
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
                <Typography
                  color="textSecondary"
                  sx={{
                    "& a": { color: "primary.main", textDecoration: "none" },
                  }}
                >
                  Masukan file di sini atau klik untuk mengunggah.{" "}
                  <Link href="/" onClick={(e) => e.preventDefault()}>
                    cari
                  </Link>{" "}
                  di komputer Anda
                </Typography>
                <Typography color="textSecondary">
                  File yang diizinkan "*.jpg, *.jpeg, *.png, *.pdf"
                </Typography>
              </Box>
            </Box>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;
