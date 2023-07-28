import React, { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetSinglePet = (id) => {
  const [petDetails, setPetDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    const getPetDetails = async () => {
      const response = await fetch("/api/pets/" + id, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setPetDetails(json);
        setIsLoading(false);
      } else {
        setError(json.error);
        setIsLoading(false);
      }
    };
    getPetDetails();
  }, [id]);

  return { petDetails, error, isLoading };
};
