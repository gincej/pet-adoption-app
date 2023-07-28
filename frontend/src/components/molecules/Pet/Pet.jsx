import React from "react";
import styles from "./Pet.module.scss";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import classNames from "classnames";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Like from "../../atoms/Icons/Like";
import Edit from "../../atoms/Icons/Edit";
import { lt } from "date-fns/locale";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import Delete from "../../atoms/Icons/Delete";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";

const Pet = (props) => {
  const {
    _id,
    breed,
    gender,
    name,
    age,
    author,
    likes,
    reserved,
    distance,
    createdAt,
    pictures,
  } = props.pet;

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const handleViewPet = (id) => {
    navigate(`/pets/${_id}`);
  };

  return (
    <div
      className={classNames(styles.pet, {
        [styles["pet--reserved"]]: reserved,
      })}
    >
      {user.id !== author._id && !user?.isAdmin ? (
        <div className={styles.pet__favorite}>
          <Like pet={props.pet} user={user} />
        </div>
      ) : (
        <div className={styles.pet__useractions}>
          {!user?.isAdmin && (
            <Link to={`/edit/${_id}`} className={styles.pet__edit}>
              <Edit />
            </Link>
          )}
          <div className={styles.pet__delete} onClick={props.onDeletePet}>
            <Delete />
          </div>
        </div>
      )}

      <div className={styles.pet__picture} onClick={() => handleViewPet(_id)}>
        <img src={`/Pets/${pictures[0]}`} alt="Pet" />
        {reserved && <span>REZERVUOTAS</span>}
      </div>
      <div
        className={classNames(styles.pet__info, {
          [styles["pet__info--reserved"]]: reserved,
        })}
      >
        <div
          className={styles.pet__name}
          title={author.isOrganisation ? "Prieglaudos augintinis" : undefined}
        >
          <h3 onClick={() => handleViewPet(_id)}>{name}</h3>
          {author.isOrganisation && author.organisationTitle && (
            <PetsRoundedIcon fontSize="large" />
          )}
        </div>

        <div className={styles.pet__traits}>
          <p>{age}.</p>
          <p>-</p>
          <p>{gender}</p>

          <p>-</p>
          <p>{breed}</p>
        </div>

        {user.id !== author._id ? (
          <div className={styles.pet__userlocation}>
            {distance > -1 && (
              <div className={styles.pet__location}>
                <LocationOnOutlinedIcon fontSize="large" />
                <p>~{distance} km. nuo jūsų</p>
              </div>
            )}

            <div className={styles.pet__user}>
              <PersonOutlineOutlinedIcon fontSize="large" />
              <Link to={`/user/${author._id}`}>
                {author.isOrganisation && author.organisationTitle
                  ? author.organisationTitle
                  : author.username}
              </Link>
            </div>
            <p className={styles.pet__createdAt}>
              Įkelta{" "}
              {formatDistanceToNowStrict(new Date(createdAt), {
                addSuffix: true,
                locale: lt,
              })}
              .
            </p>
          </div>
        ) : likes.length > 0 ? (
          <p>Pažymėjo: {likes.length} vartotojai.</p>
        ) : (
          <p>Dar niekas nepažymėjo skelbimo.</p>
        )}
      </div>
    </div>
  );
};

export default Pet;
