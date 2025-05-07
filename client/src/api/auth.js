import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (formData) => {
  return await axiosInstance.post("/auth/register", formData);
};
export const loginUser = async (formData) => {
  return await axiosInstance.post("/auth/login", formData);
};
export const authenticateUser = async (token) => {
  return await axiosInstance.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const resendEmailVerifyLink = async (token) => {
  return await axiosInstance.post(
    "/auth/resend-verification-email",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyEmailAccount = async (userId, verificationToken, token) => {
  return await axiosInstance.patch(
    `/auth/verify-account/${userId}/${verificationToken}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const sendForgotPasswordMail = async (formData) => {
  return await axiosInstance.post("/auth/sendforgot-password-mail", formData);
};

export const resetPassword = async (userId, passwordToken, formData) => {
  return axiosInstance.patch(
    `/auth/reset-password/${userId}/${passwordToken}`,
    formData
  );
};

export const logout = async () => {
  return await axiosInstance.post("/auth/logout", {});
};

export const followUser = async (userId, token) => {
  return axiosInstance.patch(
    `/auth/follow/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const getAUser = async (username, token) => {
  return axiosInstance.get(`/auth/profile/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfilePicture = async (image, token) => {
  return axiosInstance.patch(`/auth/updateProfilePicture/`, image, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = async (formData, token) => {
  return axiosInstance.patch(`/auth/update-profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRandomUsers = async (token) => {
  return axiosInstance.get(`/auth/get-random-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserFollowers = async (username, token) => {
  return axiosInstance.get(`/auth/followers/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getUserFollowing = async (username, token) => {
  return axiosInstance.get(`/auth/following/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserPassword = async (formData, token) => {
  return axiosInstance.patch("/auth/update-password", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserPrivacy = async (formData, token) => {
  return axiosInstance.patch("/auth/update-privacy", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteAccount = async (token) => {
  return axiosInstance.delete("/auth/delete-account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchUsers = async (searchTerm, token) => {
  return await axiosInstance.get(`/auth/search?q=${searchTerm}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
