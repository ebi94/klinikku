import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { setCookie } from "cookies-next";
import authConfig from "src/configs/auth";

// import setAlert from 'src/hooks/useAlert';

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    // Init Auth Dummy
    // const initAuth = async () => {
    //   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
    //   if (storedToken) {
    //     setLoading(true);
    //     await axios
    //       .get(authConfig.meEndpoint, {
    //         headers: {
    //           Authorization: storedToken
    //         }
    //       })
    //       .then(async (response) => {
    //         setLoading(false);
    //         setUser({ ...response.data.userData });
    //       })
    //       .catch(() => {
    //         localStorage.removeItem('userData');
    //         localStorage.removeItem('refreshToken');
    //         localStorage.removeItem('accessToken');
    //         setUser(null);
    //         setLoading(false);
    //         if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
    //           router.replace('/login');
    //         }
    //       });
    //   } else {
    //     setLoading(false);
    //   }
    // };
    const initAuth = async () => {
      setLoading(true);
      const userData = window.localStorage.getItem("userData");
      if (userData) {
        setLoading(false);
        setUser(JSON.parse(userData));
      } else {
        localStorage.removeItem("userData");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        setUser(null);
        setLoading(false);
        if (
          authConfig.onTokenExpiration === "logout" &&
          !router.pathname.includes("login")
        ) {
          router.replace("/login");
        }
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginDummy = (params, errorCallback) => {
    axios

      .post(authConfig.loginEndpoint, params)

      // .post(baseUrlAPI + authConfig.loginEndpoint, params)
      .then(async (response) => {
        window.localStorage.setItem("base url api", authConfig.loginEndpoint);
        params.rememberMe
          ? window.localStorage.setItem(
              authConfig.storageTokenKeyName,
              response.data.accessToken
            )
          : null;
        const returnUrl = router.query.returnUrl;
        setUser({ ...response.data.userData });
        setCookie("userData", { ...response.data.userData });
        params.rememberMe
          ? window.localStorage.setItem(
              "userData",
              JSON.stringify(response.data.userData)
            )
          : null;

        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        router.replace(redirectURL);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogin = (data) => {
    if (+data?.data?.role?.role_id === 16) {
      const filteredPermissions = data?.data?.role?.permission.filter(
        (section) => section.section_id !== 1 && section.section_id !== 72
      );
      console.log("filteredPermissions", filteredPermissions);
      const dataModify = {
        ...data,
        data: {
          ...data?.data,
          role: { ...data?.data?.role, permission: filteredPermissions },
        },
      };
      window.localStorage.setItem("userData", JSON.stringify(dataModify));
      window.localStorage.setItem(
        "auth-config",
        authConfig.storageTokenKeyName
      );
      setCookie("userData", JSON.stringify(dataModify));

      const returnUrl = router.query.returnUrl;
      setUser({ ...dataModify.data });

      const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
      router.reload(redirectURL);
    } else if (+data?.data?.role?.role_id === 13) {
      const filteredPermissions = data?.data?.role?.permission.filter(
        (section) => section.section_id !== 72
      );
      console.log("filteredPermissions", filteredPermissions);
      const dataModify = {
        ...data,
        data: {
          ...data?.data,
          role: { ...data?.data?.role, permission: filteredPermissions },
        },
      };
      window.localStorage.setItem("userData", JSON.stringify(dataModify));
      window.localStorage.setItem(
        "auth-config",
        authConfig.storageTokenKeyName
      );
      setCookie("userData", JSON.stringify(dataModify));

      const returnUrl = router.query.returnUrl;
      setUser({ ...dataModify.data });

      const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
      router.reload(redirectURL);
    } else {
      window.localStorage.setItem("userData", JSON.stringify(data));
      window.localStorage.setItem(
        "auth-config",
        authConfig.storageTokenKeyName
      );
      setCookie("userData", JSON.stringify(data));

      const returnUrl = router.query.returnUrl;
      setUser({ ...data.data });

      const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
      router.reload(redirectURL);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push("/login");
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
