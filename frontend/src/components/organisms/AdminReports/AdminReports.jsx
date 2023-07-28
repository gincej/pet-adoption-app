import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminReports.module.scss";
import { lt } from "date-fns/locale";
import classNames from "classnames";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import AlertForm from "../../molecules/AlertForm";
import { useGetAllReports } from "../../../hooks/useGetAllReports";
import { useAuthContext } from "../../../hooks/useAuthContext";

const AdminReports = () => {
  const [reports, setReports] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [userToAlert, setUserToAlert] = useState(0);

  const { user } = useAuthContext();
  const { reportList, reportError, areReportsLoading } = useGetAllReports(user);

  const handleShowForm = (id) => {
    setShowForm(true);
    setUserToAlert(id);
  };

  useEffect(() => {
    if (reportList) {
      const groups = reportList.reduce((grouped, report) => {
        if (!grouped[report.user._id]) {
          grouped[report.user._id] = [];
        }
        grouped[report.user._id].push(report);
        return grouped;
      }, {});
      setReports(groups);
    }
  }, [reportList]);

  return (
    <div className={styles.reports}>
      {showForm && (
        <AlertForm
          user={user}
          onClose={() => setShowForm(false)}
          userId={userToAlert}
        />
      )}
      <h3>Gauti pranešimai apie netinkamą veiklą</h3>
      {areReportsLoading ? (
        <LoadingSpinner />
      ) : reportError ? (
        <p>{reportError}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Apie naudotoją</th>
              <th>Tekstas</th>
              <th>Data</th>
              <th>Siuntėjas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(reports)?.map(([id, report]) => (
              <tr key={id}>
                <td>
                  <Link to={`/user/${id}`} className={styles.reports__name}>
                    {report[0].user.isOrganisation &&
                    report[0].user.organisationTitle
                      ? report[0].user.organisationTitle
                      : report[0].user.username}
                  </Link>
                </td>
                <td className={styles.reports__text}>
                  <table className={styles.reports__table}>
                    <tbody>
                      {report.map((entry) => (
                        <tr key={entry._id}>
                          <td>{entry.text ? entry.text : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className={styles.reports__table}>
                    <tbody>
                      {report.map((entry) => (
                        <tr key={entry._id}>
                          <td>
                            {formatDistanceToNowStrict(
                              new Date(entry.createdAt),
                              {
                                addSuffix: true,
                                locale: lt,
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className={styles.reports__table}>
                    <tbody>
                      {report.map((entry) => (
                        <tr key={entry._id}>
                          <td>
                            <Link
                              to={`/user/${entry.sender._id}`}
                              className={styles.reports__name}
                            >
                              {entry.sender.isOrganisation
                                ? entry.sender.organisationTitle
                                : entry.sender.username}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>
                  {!report[0].user.alert ? (
                    <p
                      onClick={() => handleShowForm(report[0].user._id)}
                      className={classNames(
                        styles.reports__alert,
                        styles["reports__alert--button"]
                      )}
                    >
                      Siųsti perspėjimą
                    </p>
                  ) : (
                    <p className={styles.reports__alert}>
                      Naudotojas dar neperskaitė perspėjimo
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div
        className={classNames({
          [styles["reports--overlay"]]: showForm,
        })}
      ></div>
    </div>
  );
};

export default AdminReports;
