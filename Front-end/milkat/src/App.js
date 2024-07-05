import "./App.scss";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <div className="container">
        <Navbar />
        <div className="content">
          <p>Contentlorem ipsum Lorem ipsum dolor sit amet, consectetur</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
