import axios from "axios";

const axiosClient = axios.create({
  // baseURL: 'http://localhost:8000',
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// axiosClient.interceptors.request.use((config) => {
//   const token = window.localStorage.getItem("TOKEN");

//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }

//   return config;
// }, (error) => {
//   Promise.reject(error);
// });

// axiosClient.interceptors.response.use( async (response) => {
//   const { token, refreshToken } = response.data;

//   if (token) {
//     window.localStorage.setItem(TOKEN, token);
//   }

//   if (refreshToken) {
//     window.localStorage.setItem(REFRESH_TOKEN, refreshToken);
//   }

//   return response.data;
// }, async (error) => {
//   if (error?.response?.status !== 401) {
//     Promise.reject(error);
//   }

//   const originalConfig = error.config;

//   if (error?.response?.status === 401 && !originalConfig.sent) {
//     originalConfig.sent = true;

//     try {
//       const token = window.localStorage.getItem(TOKEN);
//       const refreshToken = window.localStorage.getItem(REFRESH_TOKEN);

//       if (!token) {
//         window.location.href = '/login';

//         return Promise.reject(error);
//       }

//       if (refreshToken) {
//         const res = await axiosClient.post('auth/refresh-token', {
//           refreshToken,
//         });

//         const { token } = res.data;
//         window.localStorage.setItem(TOKEN, token);

//         originalConfig.headers = {
//           ...originalConfig.headers,
//           Authorization: `Bearer ${token}`,
//         }

//         return axiosClient(originalConfig);
//       } else {
//         return Promise.reject(error);
//       }
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   }
// });

export default axiosClient;
