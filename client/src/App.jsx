import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Landing from "./views/Landing/Landing";
import Home from "./views/Home/Home";
import Detail from "./views/Detail/Detail";
import Form from "./views/Form/Form";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route exact path="/videogames/:id" element={<Detail />} />
        <Route exact path="/createGame" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;
