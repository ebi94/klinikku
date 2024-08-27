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

const listAdvertisement = async () => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/advertisements/list`, requestOptions).then(
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

const addAdvertisement = async (payload) => {
  const headersUpload = new Headers();

  headersUpload.append("Authorization", `Bearer ${token}`);

  const formData = new FormData();
  formData.append("name", payload?.name);
  formData.append("company_name", payload?.company_name);
  formData.append("pic", payload?.pic);
  formData.append("pic_phone", payload?.pic_phone);
  formData.append("start_date", payload?.start_date);
  formData.append("end_date", payload?.end_date);
  formData.append("content", payload?.content);

  const requestOptions = {
    method: "POST",
    headers: headersUpload,
    body: formData,
    redirect: "follow",
  };

  return await fetch(
    `${baseUrl}api/backoffice/advertisement/create`,
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

const editAdvertisement = async (payload) => {
  const headersUpload = new Headers();

  headersUpload.append("Authorization", `Bearer ${token}`);

  const formData = new FormData();

  formData.append("advertisement_id", payload?.advertisement_id);
  formData.append("name", payload?.name);
  formData.append("company_name", payload?.company_name);
  formData.append("pic", payload?.pic);
  formData.append("pic_phone", payload?.pic_phone);
  formData.append("start_date", payload?.start_date);
  formData.append("end_date", payload?.end_date);
  formData.append("content", payload?.content);
  formData.append("new_content", payload?.new_content);

  const requestOptions = {
    method: "POST",
    headers: headersUpload,
    body: formData,
    redirect: "follow",
  };

  return await fetch(
    `${baseUrl}api/backoffice/advertisement/update?_method=PUT`,
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

export { listAdvertisement, addAdvertisement, editAdvertisement };
