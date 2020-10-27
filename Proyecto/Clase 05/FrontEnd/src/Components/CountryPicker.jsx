import axios from "axios";
import React, { useState, useEffect } from "react";
import { NativeSelect, FormControl } from "@material-ui/core";
import styles from "../styles/CountryPicker.css";

const url = "https://covid19.mathdro.id/api";

  const fetchCountries = async () => {
    try {
      const {
        data: { countries },
      } = await axios.get(`${url}/countries`);
      return countries.map((country) => country.name);
    } catch (error) {
      console.log(error);
    }
  };

  export const fetchData = async (country) => {
    let changeableUrl = url;
    if (country) {
      changeableUrl = `${url}/countries/${country}`;
    }
  
    try {
      const {
        data: { confirmed, recovered, deaths, lastUpdate },
      } = await axios.get(changeableUrl);
  
      return {
        confirmed,
        recovered,
        deaths,
        lastUpdate,
      };
    } catch (error) {
      console.log(error);
    }
  };

export const CountryPicker = ({ handleCountryChange }) => {
  const [fetchedCountries, setFetchedCountries] = useState([]);
  useEffect(() => {
    const fetchAPI = async () => {
      setFetchedCountries(await fetchCountries());
    };
    fetchAPI();
  }, [setFetchedCountries]);

  return (
    <FormControl className={styles.formControl}>
      <NativeSelect
        defaultValue=""
        onChange={(e) => handleCountryChange(e.target.value)}
      >
        <option value="">Global</option>
        {fetchedCountries.map((country, key) => (
          <option key={key} value={country}>
            {country}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

