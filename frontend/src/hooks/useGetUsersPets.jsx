import React, { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetUsersPets = (id) => {
  const [userPets, setUserPets] = useState(null);
  const [petError, setPetError] = useState(null);
  const [arePetsLoading, setArePetsLoading] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    const getUserPets = async () => {
      setArePetsLoading(true);
      const response = await fetch("/api/pets/user/" + id, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const json = await response.json();

      if (response.ok) {
        setUserPets(json);
        setArePetsLoading(false);
      } else {
        setPetError(json.error);
        setArePetsLoading(false);
      }
    };
    getUserPets();
  }, [id]);

  return { userPets, petError, arePetsLoading };
};
