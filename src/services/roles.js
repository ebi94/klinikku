const headers = new Headers();
let userData;
if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem('userData'));
}
const token = userData?.data?.access_token;
headers.append('Content-Type', 'application/json');
headers.append('token', `Bearer ${token}`);

const listRole = async () => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`/api/roles/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export { listRole };
