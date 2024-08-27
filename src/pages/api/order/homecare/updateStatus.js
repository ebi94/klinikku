import axios from "axios";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  if (req.method === "PUT") {
    const headers = {
      Authorization: accessToken,
    };

    const { status, reason, clinic_id, nurse_id } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ error: "Missing required fields in the request body" });
    }

    const bodyReq = { status, reason, clinic_id, nurse_id };

    const { searchParams } = new URL(`${baseUrl}${req.url}`);
    const id = searchParams.get("id");

    const requestOptions = {
      method: "PUT",
      url: `${baseUrl}api/backoffice/order-management/order-homecare/update/${id}`,
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
          res.status(statusCode).json({ error: errorMessage, test: id });
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
