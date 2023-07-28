import React, { useState, useEffect } from "react";

export const useGetAllUsers = (user) => {
  const [userList, setUserList] = useState(null);
  const [userError, setUserError] = useState(null);
  const [areUsersLoading, setAreUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/user/", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setUserList(json);
        setAreUsersLoading(false);
      }

      if (!response.ok) {
        setAreUsersLoading(false);
        setUserError(json.error);
      }
    };
    fetchUsers();
  }, []);

  return { userList, userError, areUsersLoading };
};
