import axios from "axios";
import requestIp from "request-ip";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const apiAuthorization = process.env.NEXT_PUBLIC_API_AUTHORIZATION;

  if (req.method === "POST") {
    const ip_address = requestIp.getClientIp(req);
    const { username, password, device_id } = req.body;

    if (!username || !password || !device_id) {
      return res.status(400).json({
        error: "Missing required fields in the request body",
        req: req?.body,
      });
    }

    const headers = {
      Authorization: apiAuthorization, // Add 'Bearer' prefix to the token
    };

    const bodyReq = {
      username,
      password,
      device_id,
      ip_address,
    };

    const requestOptions = {
      method: "POST",
      url: `${baseUrl}api/backoffice/auth/login`,
      headers,
      data: bodyReq,
      redirect: "follow",
    };

    axios
      .request(requestOptions)
      .then(function (response) {
        res.status(200).json({
          result: {
            status: response?.status,
            data: response?.data?.data,
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
            req: { error: error },
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
