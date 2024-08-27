const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
const headers = new Headers();
let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listNotifications = async () => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/pushNotications/list`, requestOptions).then(
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

const addNotification = async (payload) => {
  const bodyReq = {
    title: payload?.title,
    message: payload?.message,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/pushNotications/add`, requestOptions).then(
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

export { listNotifications, addNotification };
