import React from "react";
import "../App.css"
import "../styles/Catalogo.css";

  

  export default class Filter extends React.Component {
    render() {
      return (        
        <div className="filter">
            <div className="filter-result">{this.props.count} Products</div>
            <div className="filter-sort"> 
                Type {" "}
                <select className="filter-sort"  
                value={this.props.type} onChange={this.props.typeProducts}>
                    <option value="">ALL</option>
                    <option value="mascara">Mascaras</option>
                    <option value="desinfectante">Desinfectante</option>
                    <option value="termometro">Termometro</option>
                    <option value="prueba">Pruebas</option>
                </select>
            </div>
        </div>
      )
    }
  }

