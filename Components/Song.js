import {React, useState, useEffect} from 'react';
import axios from "axios";
import '../Styles/Song.css';
//import '/Users/BenjaminKim/Desktop/hoosintune/src/Styles/Header.css'

function Song() {

  const CLIENT_ID = "b43b59841c18443191db92088cdb3120"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [recs, setRecs] = useState([]) 
  const [token, setToken] = useState("")
  const [info, setInfo] = useState("")
  const [min_danceability_param, setMinDanceability] = useState("")
  const [max_danceability_param, setMaxDanceability] = useState("")
  const [min_tempo_param, setMinTempo] = useState("")
  const [max_tempo_param, setMaxTempo] = useState("")

useEffect(()=> {
     
    axios.get("https://api.openweathermap.org/data/2.5/weather?lat=38&lon=78&appid=99dabef4a839541fb92eecd27bf8d2b0").then(info => {
      console.log(info.data)
      setInfo([Math.round(1.8*(info.data.main.temp-273) +32 ),
        info.data.weather[0].description, 
        info.data.clouds.all 
      ])
    })}, []
  )


useEffect(()=> {

    if (info[0] > 60) {
        setMinDanceability(0.7);
    } else {
        setMinDanceability(0.1);
    }

    if (info[0] > 60) {
        setMaxDanceability(0.9);
    } else {
        setMaxDanceability(0.3);
    }

    if (info[2] < 60) {
        setMinTempo(100);
         // when clear skies, 100, when dark/cloudy, set min_tempo to 1  
    } else {
        setMinTempo(1);
    }

    if (info[2] < 60) {
        setMaxTempo(200);
         // when clear skies, 200, when dark/cloudy, set max_tempo to 50  
    } else {
        setMaxTempo(100);
    } 

console.log(max_tempo_param)

})
   

  useEffect(() => {

      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)

  }, [])

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
  }

  const searchRecs = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/recommendations", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            seed_artists: "3pc0bOVB5whxmD50W79wwO",
            //LEON spotify:artist:3qnGvpP8Yth1AqSBMqON5x, 3pc0bOVB5whxmD50W79wwO, 
            seed_genres: "rap,pop,country", 
            // country rap, pop
            seed_tracks: "1Cv1YLb4q0RzL6pybtaMLo",
            // BEYOND "spotify:track:1Omt5bfz1tZUCqd26HxbS0",1Cv1YLb4q0RzL6pybtaMLo, 
            limit: 1,
            max_instrumentalness: 0.5,
            min_danceability: min_danceability_param,
            // when dark/cloudy, set min_danceability to 0.1
            max_danceability: max_danceability_param,
            // when dark/cloudy, set max_danceability to 0.3  
            min_tempo: min_tempo_param,
            // when dark/cloudy, set min_tempo to 1  
            max_tempo: max_tempo_param,
            // when dark/cloudy, set max_tempo to 50  
            min_acousticness: 0.1
          
        }
    })
  console.log(data)
    setRecs([data.tracks[0].name, data.tracks[0].artists[0].name, data.tracks[0].album.images[0].url, 
        data.tracks[0].external_urls.spotify])
    // console.log(recs)

  }

  

//   const renderRecs = () => {
//     return recs.map(rec => (
//         <div key={rec.id}>
//             {rec.images.length ? <img width={"20%"} src={rec.images[0].url} alt=""/> : <div>No Image</div>}
//             {rec.name}
//         </div>
//     ))
//   }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "artist",
            limit: 1
        }
    })

    setArtists(data.artists.items)
    console.log(artists);
  }

  const renderArtists = () => {
    return artists.map(artist => (
        <div key={artist.id}>
            {artist.images.length ? <img width={"20%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
            {artist.name}
        </div>
    ))
  }

  

  return (
      <div>
        <p> SONG: {recs[0]} </p>
        <p> ARTIST: {recs[1]} </p>
         {/* ARTIST: {recs[1]} 
        <div style={{ textAlign: 'center' }}>
            <header className="song">
            SONG: {recs[0]}
            </header>

            
        </div>
        
        <button onClick ={searchRecs} type={"submit"}>Search Recs</button>
  
          <p> SONG: {recs[0]} </p>
          <p> ARTIST: {recs[1]} </p>

          
  */}
     <a href={recs[3]}>Click here to listen </a>
  

    <div style={{ textAlign: 'center' }}>     
        <img src={recs[2]} width='250'/>
    </div>
            
          {/* <header className="App-header">
              
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                      to Spotify</a>
                  : <button onClick={logout}>Logout</button>}
          </header> */}

          {/* <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                <button type={"submit"}>Search Artists</button>
          </form> 

          {renderArtists()} */}
      </div>
  )
}

export default Song;