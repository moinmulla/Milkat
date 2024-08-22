import { useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Listup from "./pages/listup/Listup";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Prediction from "./pages/prediction/Prediction";
import Property from "./pages/property/Property";
import Modal from "./components/modal/Modal";
import { toast, ToastContainer } from "react-toastify";
import CryptoJS from "crypto-js";
import { LoginProvider, LoginContext } from "./hooks/LoginContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Protected_Route = ({ children }) => {
  const { login, role, token } = useContext(LoginContext);
  // const secret_key = `${process.env.REACT_APP_SECRET_KEY}` || "secret_key";

  console.log(role, token, role);
  if (!document.cookie) {
    setTimeout(() => {
      toast.error("Please login first", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }, 1);

    return <Home />;
  }

  // const cookie_value = decodeURIComponent(document.cookie);

  // const temp_token = cookie_value.match(new RegExp("token=([^;]+)"));

  // const bytes = CryptoJS.AES.decrypt(temp_token[1], secret_key);

  // const decrypted_token = bytes.toString(CryptoJS.enc.Utf8);

  // const role = decrypted_token.match(new RegExp("role=([^;]+)"));
  // const token = decrypted_token.match(new RegExp("token=([^;]+)"));
  // const name = decrypted_token.match(new RegExp("name=([^;]+)"));

  const role1 = role;
  const name1 = login;
  const token1 = token;

  console.log(role1, token1, name1);

  // changeLogin(name[1]);

  // if (role && role[1] !== "admin" && children === <AdminDashboard />) {
  //   return children;
  // }

  // if (role && role[1] === "user" && children === <UserDashboard />) {
  //   return children;
  // }

  return token1 !== "" ? children : <Home />;
};

function App({ children }) {
  return (
    <div className="app">
      <div className="container">
        <BrowserRouter>
          <LoginProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/property/:pid" element={<Property />} />
              <Route
                path="/listup"
                element={
                  <Protected_Route>
                    <Listup />
                  </Protected_Route>
                }
              />
              {/* <Route
              path="/admin_dashboard"
              element={
                <Protected_Route>
                  <AdminDashboard />
                </Protected_Route>
              }
            />
            <Route
              path="/user_dashboard"
              element={
                <Protected_Route>
                  <UserDashboard />
                </Protected_Route>
              }
            /> */}
              <Route path="*" element={<Home />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="colored"
            />
          </LoginProvider>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
