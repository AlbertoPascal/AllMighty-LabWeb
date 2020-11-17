import React from 'react';
import { Bar } from "react-chartjs-2";
import { Card} from "react-bootstrap";
import styles from "../styles/CovidCharts.css";

export default class PurchasesProfile extends React.Component {	

    constructor(props){
        super(props);

    }

	render() {
        	
		return (
            <Card style={{ width: '30rem' , height:'20rem', margin:"auto", display:"block"}} className={styles.container}>
                <h1 style = {{textAlign:"center", fontFamily:"Verdana"}}>Compras realizadas</h1>
                <br/>
                <Bar
                    data={{
                    labels: ["Desinfectantes", "Cubrebocas", "Pruebas", "Termometros"],
                    datasets: [
                        {
                        label: "Compras",
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
                            this.props.desinfectante,
                            this.props.mascaras,
                            this.props.pruebas,
                            this.props.termometro
                        ],
                        },
                    ],
                    }}
                    width={50} 
                    height={50}
                    options={{
                        legend: { display: false }
                    }}
                />
                
            </Card>
		);
	}
}
         