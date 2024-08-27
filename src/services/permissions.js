const headers = new Headers();
let userData;
if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem('userData'));
}
const token = userData?.data?.access_token;
headers.append('Content-Type', 'application/json');
headers.append('token', `Bearer ${token}`);

const listPermission = async () => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`/api/permissions/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const addPermission = async (payload) => {
  const bodyReq = {
    name: payload?.name,
    permission: payload?.permission
  };

  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/permissions/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const editPermission = async (payload) => {
  const bodyReq = {
    id: payload?.id,
    name: payload?.name,
    permission: payload?.permission
  };

  const requestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/permissions/edit/`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export { listPermission, addPermission, editPermission };
