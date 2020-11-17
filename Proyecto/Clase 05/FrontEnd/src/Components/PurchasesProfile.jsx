import React from 'react';
import CanvasJSReact from '../assets/canvasjs.react';

export default class PurchasesProfile extends React.Component {	

    constructor(props){
        super(props);

    }

	render() {

		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", 
			title:{
				text: "Compras realizadas"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}",		
				startAngle: -90,
				dataPoints: [
					{ y: this.props.desinfectante, label: "Desinfectantes" },
					{ y: this.props.mascaras, label: "mascaras" },
					{ y: this.props.pruebas, label: "pruebas" },
					{ y: this.props.termometro, label: "termometros" },
				]
			}]
		}
		
		return (
		<div>
			<CanvasJSReact.CanvasJSChart options = {options} />
			
		</div>
		);
	}
}
         