// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import BarChartRace from './BarChartRace';

function App() {
  return (
    <div style={{ padding: "0px 20px 0px 20px", margin:"0 0 0 0", fontFamily: "Arial, sans-serif" }}>
  <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
    Population Growth per Country (1950–2021)
  </h1>

  <h1 style={{ fontSize: "20px", margin: "-10px 0px 10px 0px", color: "#555" }}>
    Click on the legend below to filter by continent
  </h1>
  <div style={{ margin: "0 20px", fontSize: "16px", color: "#555", display: "flex", gap: "16px", alignItems: "center" }}>
  <strong style={{ marginRight: "10px" }}>Regions:</strong>

  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span style={{ width: "12px", height: "12px", backgroundColor: "#4682b4", borderRadius: "50%" }}></span>
    Asia
  </span>

  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span style={{ width: "12px", height: "12px", backgroundColor: "#ff9f00", borderRadius: "50%" }}></span>
    Europe
  </span>

  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span style={{ width: "12px", height: "12px", backgroundColor: "#16ff59", borderRadius: "50%" }}></span>
    Africa
  </span>

  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span style={{ width: "12px", height: "12px", backgroundColor: "#08006f", borderRadius: "50%" }}></span>
    Oceania
  </span>

  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <span style={{ width: "12px", height: "12px", backgroundColor: "#ca009f", borderRadius: "50%" }}></span>
    Americas
  </span>
</div>



  <BarChartRace />
</div>
  );
}

export default App;
