import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

import RegisterCommercant from "./components/RegisterCommercant.js";
import "./App.css"; 

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/")
      .then(response => setMessage(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    
    
    <div className="App">
       <RegisterCommercant />
  </div>
  );

  
    
  
}
export default App;


