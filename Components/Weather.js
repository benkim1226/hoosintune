import {React, useState, useEffect} from 'react';
import '../Styles/Weather.css';
import axios from "axios";



function WeatherAPI() {
    const [info, setInfo] = useState([])

    useEffect(()=> {
     
        axios.get("https://api.openweathermap.org/data/2.5/weather?lat=38&lon=78&appid=99dabef4a839541fb92eecd27bf8d2b0").then(info => {
          console.log(info.data.wind.speed)
          setInfo([Math.round(1.8*(info.data.main.temp-273) +32 ),info.data.weather[0].description, info.data.wind.speed] )
        })}, []
      )
      
      
        return (
            <div style={{ textAlign: 'center'}}>
            Charlottesville weather: {info[0]} degrees F, {info[1]}, {info[2]} mph wind
            </div>

            
        );
    

    
}

export default WeatherAPI;