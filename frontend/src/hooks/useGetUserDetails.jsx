import React, { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetUserDetails = (id) => {
  const [userDetails, setUserDetails] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [userError, setUserError] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await fetch("/api/user/" + id, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setUserDetails(json.singleUser);
        setAvgRating(json.averageRating);
        setIsUserLoading(false);
      } else if (!response.ok) {
        setUserError(json.error);
        setIsUserLoading(false);
      }
    };
    getUserDetails();
  }, [id]);

  return { userDetails, avgRating, userError, isUserLoading };
};
