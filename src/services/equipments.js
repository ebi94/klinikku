const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
const headers = new Headers();
let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listEquipment = async () => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/equipments/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const addEquipment = async (payload) => {
  const bodyReq = {
    name: payload?.name,
    ecommerceLink: payload?.ecommerceLink,
    imageLink: payload?.imageLink,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/equipments/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const editEquipment = async (payload) => {
  const bodyReq = {
    equipment_id: payload?.equipment_id,
    name: payload?.name,
    ecommerceLink: payload?.ecommerceLink,
    imageLink: payload?.imageLink,
  };

  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/equipments/edit/`, requestOptions).then(
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

export { listEquipment, addEquipment, editEquipment };
