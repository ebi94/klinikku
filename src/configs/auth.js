// export default {
//   userEndpoint: `/api/auth/backoffice`,
//   loginEndpoint: `/api/auth/backoffice`
// };

export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
};
