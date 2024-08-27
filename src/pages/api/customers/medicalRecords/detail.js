import axios from "axios";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  if (req.method === "GET") {
    const headers = {
      Authorization: accessToken,
    };

    const { searchParams } = new URL(`${baseUrl}${req.url}`);
    const id = searchParams.get("id");

    const requestOptions = {
      method: "GET",
      url: `${baseUrl}api/backoffice/customers/get-by-id/${id}`,
      headers,
    };

    axios
      .request(requestOptions)
      .then(function (response) {
        const data = response?.data?.data;
        res.status(200).json({
          result: {
            status: response?.status,
            data: data,
            message: response?.data?.message,
          },
        });
      })
      .catch(function (error) {
        if (error.response) {
          const errorMessage =
            error?.message || "An error occurred during the request.";
          const statusCode = error?.response?.status || 500;
          res.status(statusCode).json({ error: errorMessage });
        } else if (error.request) {
          const errorMessage =
            error?.message || "No response received from the server.";
          res.status(500).json({ error: errorMessage });
        } else {
          res.status(500).json({
            error: "An unexpected error occurred.",
          });
        }
      });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
