import React, { useState, useEffect } from "react";
import { useLogout } from "./useLogout";

export const useGetAllPets = (user) => {
  const [petList, setPetList] = useState(null);
  const [petsError, setPetsError] = useState(null);
  const [arePetsLoading, setArePetsLoading] = useState(true);

  const { logout } = useLogout();

  useEffect(() => {
    const fetchPets = async () => {
      const response = await fetch("/api/pets", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setPetList(json);
        setArePetsLoading(false);
      }

      if (!response.ok) {
        setArePetsLoading(false);
        setPetsError(json.error);
        if (response.status === 401) {
          logout();
        }
      }
    };
    fetchPets();
  }, []);

  return { petList, petsError, arePetsLoading };
};
