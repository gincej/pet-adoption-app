import React, { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetReceivedRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState(null);
  const [receivedReqError, setReceivedReqError] = useState(null);
  const [areRequestsLoading, setAreRequestsLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    const getReceivedRequests = async () => {
      const response = await fetch("/api/request/myrequests", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const json = await response.json();

      if (response.ok) {
        setAreRequestsLoading(false);
        setReceivedRequests(json);
      } else {
        setAreRequestsLoading(false);
        setReceivedReqError(json.error);
      }
    };
    getReceivedRequests();
  }, []);

  return { receivedRequests, receivedReqError, areRequestsLoading };
};
