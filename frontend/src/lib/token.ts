export function fetchToken() {
  const localToken = localStorage.getItem("access_token");
  const sessionToken = sessionStorage.getItem("access_token");
  const localUser = localStorage.getItem("user");
  const sessionUser = sessionStorage.getItem("user");

  const access_token = localToken || sessionToken;
  const user = localUser || sessionUser;
  const token = {
    access_token: access_token,
    user: user,
  };

  return token;
}
