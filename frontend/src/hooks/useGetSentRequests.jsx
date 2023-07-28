import React, { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetSentRequests = () => {
  const [userReservations, setUserReservations] = useState(null);
  const [userResError, setUserResError] = useState(null);
  const [isUserResLoading, setIsUserResLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    const getUserRequests = async () => {
      const response = await fetch("/api/request", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const json = await response.json();

      if (response.ok) {
        setIsUserResLoading(false);
        setUserReservations(json);
      } else {
        setIsUserResLoading(false);
        setUserResError(json.error);
      }
    };
    getUserRequests();
  }, []);

  return { userReservations, userResError, isUserResLoading };
};
