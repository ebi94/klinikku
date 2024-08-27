import axios from "axios";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  if (req.method === "POST") {
    const { treatment_id, supporting_data } = req.body;

    function checkMissingFields() {
      const missingFields = [];
      if (!treatment_id) missingFields.push("treatment_id");
      if (!supporting_data) missingFields.push("supporting_data");

      return missingFields;
    }

    // Usage in your API handler
    const missingFields = checkMissingFields();
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields in the request body",
        missingFields: missingFields,
      });
    }

    const headers = {
      Authorization: accessToken,
    };

    const bodyReq = {
      treatment_id: `${treatment_id}`,
      supporting_data: supporting_data,
    };

    const requestOptions = {
      method: "POST",
      url: `${baseUrl}api/backoffice/customers/medical-record/wound-supporting-data/create`,
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
          if (errorMessage === "Token has expired") {
            res.status(401).json({ error: errorMessage, status: 401 });
          }
          res.status(statusCode).json({ error: errorMessage });
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
