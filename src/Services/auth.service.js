import axios from "axios";

const API_URL = (process.env.NODE_ENV != 'production' ? "https://api-es5l.onrender.com" : "https://api-es5l.onrender.com");



const login = (username, user_pass) => {
  return axios
    .post(API_URL + "/get-token", {
      username: username,
      password: user_pass,
    })
    .then((response) => {
      if (response.data.token) {
        //const { user, token } = response.data.data;
        //console.log("sdsdsd",response.data.data);
         //localStorage.setItem("user", JSON.stringify(user));
        //localStorage.setItem("userId", JSON.stringify(user._id));
        //localStorage.setItem("token", token);
        const token = response.data.token;
        localStorage.setItem("token", token);
      }

      return response.data;
    });
};


// const logout = () => {
//   localStorage.removeItem("user");
//   return axios.post(API_URL + "signout").then((response) => {
//     return response.data;
//   });
// };


const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    console.log("sdsdsddsds",userData);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};


const getCurrentUserTokken = () => {
  return JSON.parse(localStorage.getItem("token"));
};

const AuthService = {
  login,
  getCurrentUser,
  getCurrentUserTokken
}

export default AuthService;