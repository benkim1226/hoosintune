import React, {useState, useEffect} from 'react';
import axios from "axios";

function App() {

  const CLIENT_ID = "b43b59841c18443191db92088cdb3120"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [recs, setRecs] = useState("") 
  const [token, setToken] = useState("")

  // useEffect(()=> {
  //   setShow(0)
  //   axios.get("https://api.spotify.com/v1/recommendations").then(info => {
  //     console.log(info.data.results.question)
  //     setQuestion(info.data.results[0].question)
  //     console.log(info.data.results.correct_answer)
  //     setAnswer(info.data.results[0].correct_answer)
  //   })}, [trigger]
  // )


//   useEffect(()=> {

//       axios.get("https://api.openweathermap.org/data/2.5/weather?lat={38}&lon={78}&appid={99dabef4a839541fb92eecd27bf8d2b0}").then(info => {
//         console.log(info.data.results.question)
//         setQuestion(info.data.results[0].question)
//         console.log(info.data.results.correct_answer)
//         setAnswer(info.data.results[0].correct_answer)
//       })}, []
//     )



  
  
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
    const {datas} = await axios.get("https://api.spotify.com/v1/recommendations", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            seed_artists: "4NHQUGzhtTLFvgF5SZesLK",
            // 3pc0bOVB5whxmD50W79wwO?si=4d0b9b57e8b14269",
            seed_genres: "country", 
            seed_tracks: "0c6xIDDpzE81m2q797ordA",
            // "1Fhb9iJPufNMZSwupsXiRe?si=50aa20c230064cbc",
            limit: 1,
            max_instrumentalness: 0.35,
        }
    })

    setRecs(datas.artists.name)
    console.log(recs);
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
            limit: 5
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
      <div className="App">
          <header className="App-header">
              <h1>Hoos In Tune</h1>
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                      to Spotify</a>
                  : <button onClick={logout}>Logout</button>}
          </header>

          <form onSubmit={searchRecs}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                <button type={"submit"}>Search Recs</button>
          </form>
          <p> {recs} </p>
            
          <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                <button type={"submit"}>Search Artists</button>
          </form> 

          {renderArtists()}
      </div>
  )
}

export default App;