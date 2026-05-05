const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getAuthToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getAuthUser = () => {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    clearAuthSession();
    return null;
  }
};

export const setAuthSession = ({ token, user }) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(USER_KEY);
  }
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};
