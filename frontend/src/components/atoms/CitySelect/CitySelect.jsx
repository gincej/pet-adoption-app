import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import styles from "./CitySelect.module.scss";

const CitySelect = ({ onSelect }) => {
  const [initLocation, setInitLocation] = useState("");

  return (
    <div>
      <PlacesAutocomplete
        value={initLocation}
        onChange={setInitLocation}
        onSelect={onSelect}
        searchOptions={{
          types: ["(cities)"],
          componentRestrictions: { country: ["lt"] },
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={styles.dropdown}>
            <input
              {...getInputProps({
                placeholder: "Įveskite miestą",
              })}
            />
            <div className={styles.dropdown__main}>
              {loading ? <p>Loading...</p> : null}
              {suggestions.map((suggestion) => {
                return (
                  <p
                    key={suggestion.id}
                    className={styles.dropdown__suggestion}
                    {...getSuggestionItemProps(suggestion)}
                  >
                    {suggestion.description}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default CitySelect;
