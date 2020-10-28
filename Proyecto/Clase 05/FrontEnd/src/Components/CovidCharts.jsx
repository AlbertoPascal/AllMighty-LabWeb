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
                "rgba(0, 0, 255, 0.5)",
                "rgba(0, 255, 0, 0.5)",
                "rgba(255, 0, 0, 0.5)",
                "rgba(242, 234, 0, 0.5)",
              ],
              hoverBackgroundColor: [
                "rgba(0, 77, 153)",
                "rgba(30, 102, 49)",
                "rgba(255, 51, 51)",
                "rgba(204, 153, 0)",
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