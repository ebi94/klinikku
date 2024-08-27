const headers = new Headers();
let userData;
if (typeof window !== 'undefined') {
  userData = JSON.parse(localStorage.getItem('userData'));
}
const token = userData?.data?.access_token;
headers.append('Content-Type', 'application/json');
headers.append('token', `Bearer ${token}`);

const listCategoryArticle = async () => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`/api/cms/article/listCategory`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const listArticle = async () => {
  const requestOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  };

  return await fetch(`/api/cms/article/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const addArticle = async (payload) => {
  const bodyReq = {
    title: payload?.title,
    slug: payload?.slug,
    meta_description: payload?.meta_description,
    content: payload?.content,
    article_category_id: `${payload?.article_category_id}`,
    media_icon_id: `${payload?.media_icon_id}`,
    active: payload?.active,
    is_highlighted: payload?.is_highlighted
  };

  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/cms/article/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const editArticle = async (payload) => {
  const bodyReq = {
    article_id: `${payload?.article_id}`,
    title: payload?.title,
    slug: payload?.slug,
    meta_description: payload?.meta_description,
    content: payload?.content,
    article_category_id: `${payload?.article_category_id}`,
    media_icon_id: `${payload?.media_icon_id}`,
    active: payload?.active,
    is_highlighted: payload?.is_highlighted
  };

  const requestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/cms/article/edit/`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const addCategory = async (payload) => {
  const bodyReq = {
    name: payload?.name,
    slug: payload?.slug
  };

  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/cms/article/addCategory`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const editCategory = async (payload) => {
  const bodyReq = {
    article_category_id: payload?.article_category_id,
    name: payload?.name,
    slug: payload?.slug
  };

  const requestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(bodyReq),
    redirect: 'follow'
  };

  return await fetch(`/api/cms/article/editCategory/`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export { listArticle, listCategoryArticle, addArticle, editArticle, addCategory, editCategory };
