import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;

// headers.append('Content-Type', 'application/json');
const headers = {
  // Authorization: '12uM47k!ta2nolDua3',
  "Content-Type": "application/json",
};

const setDeviceInfo = async () => {
  const bodyReq = {
    uid: "10928738492", //ddMMyyyyHHmmssfff
    brand_name: "Apple", //mobileModel
    model: "Macintosh", //mobileVendor
    os: "Mac OS", //osName
    os_version: "kaka9a9a", //osVersion
    browser: "CHROME", //browserName
    browser_version: "65", //browserVersion
    device_type: "browser", //deviceType
  };

  const requestOptions = {
    method: "POST",
    url: `${baseUrl}api/user-management/global/backoffice/set-device-info`,
    headers,
    data: bodyReq,
    redirect: "follow",
  };

  return await axios.request(requestOptions).then((r) => {
    let result;
    try {
      result = r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const getDeviceInfo = async (payload) => {
  const bodyReq = {
    uid: payload?.uid, //ddMMyyyyHHmmssfff
    brand_name: payload?.brand_name, //mobileModel
    model: payload?.model, //mobileVendor
    os: payload?.os, //osName
    os_version: payload?.os_version, //osVersion
    browser: payload?.browser, //browserName
    browser_version: payload?.browser_version, //browserVersion
    device_type: payload?.device_type, //deviceType
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/auth/getDeviceInfo`, requestOptions).then(
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

const login = async (payload) => {
  const bodyReq = {
    username: payload?.username,
    password: payload?.password,
    device_id: payload?.device_id,

    // ip_address: payload?.ip_address
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/auth/login`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const changePassword = async (payload) => {
  let userData;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userData"));
  }
  const headersNew = new Headers();
  const token = userData?.data?.access_token;
  headersNew.append("Content-Type", "application/json");
  headersNew.append("token", `Bearer ${token}`);

  const bodyReq = {
    user_id: payload?.user_id,
    password: payload?.password,
    password_confirmation: payload?.password_confirmation,
  };

  const requestOptions = {
    method: "PUT",
    headers: headersNew,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/auth/changePassword`, requestOptions).then(
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

export { getDeviceInfo, login, changePassword };
