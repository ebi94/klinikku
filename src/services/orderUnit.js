import { jsonToQueryParam } from "src/utils/helpers";

const headers = new Headers();
let userData;
let token;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listOrderUnit = async (patientId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  const requestBody = {
    patientId: patientId ?? "",
  };

  return await fetch(
    `/api/order/unit/list?${jsonToQueryParam(requestBody)}`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const detailOrderUnit = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/order/unit/detail?id=${id}`, requestOptions).then(
    async (r) => {
      let result;
      try {
        result = await r.json();
      } catch (e) {
        result = {};
      }

      return { ...result };
    }
  );
};

const createOrderUnit = async (payload) => {
  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  return await fetch(`/api/order/unit/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const updateStatusOrderUnit = async (id, payload) => {
  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  return await fetch(
    `/api/order/unit/updateStatus?id=${id}`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const availableTime = async (id, date) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/order/unit/availableTime?id=${id}&date=${date}`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export {
  listOrderUnit,
  detailOrderUnit,
  createOrderUnit,
  updateStatusOrderUnit,
  availableTime,
};
