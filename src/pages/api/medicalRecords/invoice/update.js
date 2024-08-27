import axios from "axios";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  if (req.method === "PUT") {
    const {
      invoice_id,
      next_visit,
      treatment_status,
      payment_type,
      is_scheduled_for_next_visit,
      additional_price,
      discount_type,
      discount_description,
      discount_amount,
    } = req.body;

    if (
      !invoice_id ||
      !treatment_status ||
      !payment_type ||
      !is_scheduled_for_next_visit ||
      !additional_price ||
      !discount_type ||
      !discount_description ||
      !discount_amount
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in the request body" });
    }

    const headers = {
      Authorization: accessToken,
    };

    const bodyReq = {
      invoice_id,
      next_visit,
      treatment_status,
      payment_type,
      is_scheduled_for_next_visit,
      additional_price,
      discount_type,
      discount_description,
      discount_amount,
    };

    const requestOptions = {
      method: "PUT",
      url: `${baseUrl}api/backoffice/transactions/invoice/update`,
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
