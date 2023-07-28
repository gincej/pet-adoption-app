import React, { useState, useEffect } from "react";

export const useGetAllReports = (user) => {
  const [reportList, setReportList] = useState(null);
  const [reportError, setReportError] = useState(null);
  const [areReportsLoading, setAreReportsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch("/api/report/", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setReportList(json);
        setAreReportsLoading(false);
      }

      if (!response.ok) {
        setAreReportsLoading(false);
        setReportError(json.error);
      }
    };
    fetchReports();
  }, []);

  return { reportList, reportError, areReportsLoading };
};
