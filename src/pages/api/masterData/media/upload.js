import axios from "axios";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  const formidableConfig = {
    keepExtensions: true,
    maxFileSize: 10_000_000,
    maxFieldsSize: 10_000_000,
    maxFields: 7,
    allowEmptyFiles: false,
    multiples: false,
  };

  if (req.method === "POST") {
    const form = formidable({ ...formidableConfig });
    let fields;
    let files;
    [fields, files] = await form.parse(req);

    const headers = {
      Authorization: accessToken,
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundaryf7LjK1bSRXbaXnTt",
    };

    const { file } = files;

    const formData = new FormData();

    formData.append("name", "name");
    formData.append("type", "Image");
    formData.append("file", file);

    const requestOptions = {
      method: "POST",
      url: `${baseUrl}api/backoffice/master-data/media/create`,
      headers,
      maxBodyLength: Infinity,
      data: formData,
      redirect: "follow",
    };

    axios
      .request(requestOptions)
      .then(function (response) {
        res.status(200).json({
          result: {
            status: response?.status,
            data: response,
            file: file[0],
            message: response?.data?.message,
          },
        });
      })
      .catch(function (error) {
        if (error.response) {
          const errorMessage =
            error?.message || "An error occurred during the request.";
          const statusCode = error?.response?.status || 500;
          res.status(statusCode).json({
            error: errorMessage,
            file: formData,
          });
        } else if (error.request) {
          res
            .status(500)
            .json({ error: "No response received from the server." });
        } else {
          res.status(500).json({ error: "An unexpected error occurred." });
        }
      });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

// const { Writable } = require('stream');
// const FormData = require('form-data');
// const formidable = require('formidable');
// const { NextApiRequest, NextApiResponse } = require('next');

// const formidableConfig = {
//   keepExtensions: true,
//   maxFileSize: 10_000_000,
//   maxFieldsSize: 10_000_000,
//   maxFields: 7,
//   allowEmptyFiles: false,
//   multiples: false
// };

// function formidablePromise(req, opts) {
//   return new Promise((accept, reject) => {
//     const form = formidable(opts);

//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return reject(err);
//       }

//       return accept({ fields, files });
//     });
//   });
// }

// const fileConsumer = (acc) => {
//   const writable = new Writable({
//     write: (chunk, _enc, next) => {
//       acc.push(chunk);
//       next();
//     }
//   });

//   return writable;
// };

// async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(404).end();

//   try {
//     const chunks = [];

//     const { fields, files } = await formidablePromise(req, {
//       ...formidableConfig,

//       // consume this, otherwise formidable tries to save the file to disk
//       fileWriteStreamHandler: () => fileConsumer(chunks)
//     });

//     const { file } = files;

//     const fileData = Buffer.concat(file);

//     const form = new FormData();
//     form.append('name', 'name');
//     form.append('type', 'Image');
//     form.append('file', fileData);

//     const apiRes = await fetch(`${baseUrl}api/backoffice/master-data/media/create`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         Authorization: `Bearer ${access}`
//       },
//       body: form
//     });

//     return res.status(204).end();
//   } catch (err) {
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// module.exports = handler;

// module.exports.config = {
//   api: {
//     bodyParser: false
//   }
// };
