import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from "./Components/Navbar/Navbar";
import Coins from "./Components/Coins/Coins";
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Coins />
    </div>
  );
}

export default App;
