import { Routes, Route } from "react-router-dom";
import { pages } from "../src/pages/index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<pages.Reservation />} />
      <Route path="/success" element={<pages.ReservationSuccess />} />
    </Routes>
  );
}

export default App;
