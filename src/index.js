import { render as ReactDOM_Render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './index.css';
import App from './App';

ReactDOM_Render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<App />}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);