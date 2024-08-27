const headers = new Headers();
let userData;
if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem('userData'));
}
const token = userData?.data?.access_token;
headers.append('Content-Type', 'application/json');
headers.append('token', `Bearer ${token}`);

const listClinic = async () => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`/api/global/clinic/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const listNurse = async (id, bookingCode) => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(
    `/api/global/nurse/list?clinic_id=${id}&booking_code=${bookingCode}`,
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

export { listClinic, listNurse };
