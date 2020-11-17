import axios from "axios";
import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import styles from "../styles/CovidCharts.css";
import { fetchDailyData } from "./CovidApi";


const Chart = ({ data: { confirmed, recovered, deaths }, country }) => {
    const [dailyData, setDailyData] = useState([]);
    useEffect(() => {
      const fetchAPI = async () => {
        setDailyData(await fetchDailyData());
      };
      fetchAPI();
    }, []);
    const lineChart = dailyData.length ? (
      <Line
        data={{
          labels: dailyData.map(({ date }) => date),
          datasets: [
            {
              data: dailyData.map(({ confirmed }) => confirmed),
              label: "Contagiados",
              borderColor: "#3333ff",
              fill: true,
            },
            {
              data: dailyData.map(({ deaths }) => deaths),
              label: "Muertes",
              borderColor: "red",
              backgroundColor: "rgba(255,0,0,0.5)",
              fill: true,
            },
          ],
        }}
      />
    ) : null;
  
    const barChart = confirmed ? (
      <Bar
        data={{
          labels: ["Contagiados", "Recuperados", "Muertes", "Activos"],
          datasets: [
            {
              label: "People",
              backgroundColor: [
                "rgba(39, 75, 140, 1)",
                "rgba(18, 95, 125, 1)",
                "rgba(17, 125, 124, 1)",
                "rgba(53, 58, 114, 1)",
              ],
              hoverBackgroundColor: [
                  "rgba(25, 47, 87)",
                  "rgba(16, 79, 104)",
                  "rgba(15, 100, 99)",
                  "rgba(40, 44, 85)",
              ],
              data: [
                confirmed.value,
                recovered.value,
                deaths.value,
                confirmed.value - (recovered.value + deaths.value),
              ],
            },
          ],
        }}
        options={{
          legend: { display: false },
          title: { display: true, text: `Mostrando estadísticas de ${country}` },
        }}
      />
    ) : null;
  
    return (
      <div className={styles.container}>{country ? barChart : lineChart}</div>
    );
  };
  
  export default Chart;