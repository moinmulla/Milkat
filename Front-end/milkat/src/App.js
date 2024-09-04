import { useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Modal from "./components/modal/Modal";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Listup from "./pages/listup/Listup";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Property from "./pages/property/Property";
import Chat from "./pages/chat/Chat";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import UserDashboard from "./pages/userDashboard/UserDashboard";
import { toast, ToastContainer } from "react-toastify";
import { LoginProvider, LoginContext } from "./hooks/LoginContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { clearData, changeLogin, changeRole, changeToken } =
    useContext(LoginContext);
  const secretKey = `${process.env.REACT_APP_SECRET_KEY}` || "secret_key";

  if (Cookies.get("token") == undefined) {
    clearData();
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

  //fetch data from cookie
  const cookieValue = decodeURIComponent(document.cookie);
  const tempToken = cookieValue.match(new RegExp("token=([^;]+)"));
  const bytes = CryptoJS.AES.decrypt(tempToken[1], secretKey);
  const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
  const role = decryptedToken.match(new RegExp("role=([^;]+)"));
  const token = decryptedToken.match(new RegExp("token=([^;]+)"));
  const name = decryptedToken.match(new RegExp("name=([^;]+)"));

  const role1 = role[1];
  const name1 = name[1];
  const token1 = token[1];

  changeLogin(name[1]);
  changeRole(role[1]);
  changeToken(token[1]);

  //requiredRole is used to render only dashboard components
  if (role && role1 === "admin" && requiredRole === "property") {
    return <AdminDashboard />;
  }

  if (role && role1 == "user" && requiredRole === "property") {
    return <UserDashboard />;
  }

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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/property/:pid" element={<Property />} />
              <Route
                path="/listup"
                element={
                  <ProtectedRoute>
                    <Listup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="property">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
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
