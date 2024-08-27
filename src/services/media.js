import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
const headers = new Headers();

let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listMedia = async (type, page, limit, query) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/masterData/media/list/?type=${type}&isPagination=true&limit=${limit}&page=${page}&name=${query}`,
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

const uploadMedia = async (payload) => {
  const headersUpload = new Headers();

  headersUpload.append("Authorization", `Bearer ${token}`);

  const formData = new FormData();

  formData.append("file", payload?.file);
  formData.append("type", payload?.type);
  formData.append("name", payload?.name);

  const requestOptions = {
    method: "POST",
    headers: headersUpload,
    body: formData,
    redirect: "follow",
  };

  return await fetch(
    `${baseUrl}api/backoffice/master-data/media/create`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { result };
  });
};

export { listMedia, uploadMedia };
