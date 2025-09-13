export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };