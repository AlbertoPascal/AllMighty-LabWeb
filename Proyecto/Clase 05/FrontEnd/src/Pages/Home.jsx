import React from "react";
import CarouselHome from '../Components/CarouselHome';
import Chart from "../Components/CovidCharts";
import {fetchData} from "../Components/CovidApi";
import CountryPicker from "../Components/CountryPicker"
import '../App.css'

class Home extends React.Component {


  state = {
    data: {},
    country: "mx",
  };

  
  async componentDidMount() {
    const fetchedData = await fetchData();
    this.setState({ data: fetchedData });
  }
  handleCountryChange = async (country) => {
    const fetchedData = await fetchData(country);
    this.setState({ data: fetchedData, country: country });
  };

  /*

  */
  render() {
    const { data, country } = this.state;
    return (
      <div>
        <br/>
        <br/>
        <CarouselHome/>
        <br/>
        <br/>
        <h1 className="titulo">Estadísticas de covid</h1>
        <br/>
        <br/>
        <CountryPicker handleCountryChange={this.handleCountryChange} />
        <Chart data={data} country={country} />
        <br/>
      </div>
    );
  }
}
export default Home;
