
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./SharedUtils/Home/HeroPage";
import Layout from "./SharedUtils/Layout";
import SignUp from "./SharedUtils/SignUp";
import SignUpForm from "./SharedUtils/SignuporLogin/SignUpForm";
import Login from "./SharedUtils/SignuporLogin/Login";
import Profile from "./SharedUtils/LoggedIn/Profile";
import Messages from "./SharedUtils/LoggedIn/Messages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<HeroPage/>} />
          <Route path="/signup"  element={<SignUp/>} />
          <Route path="/signupuser"  element={<SignUpForm/>} />
          <Route path="/login"  element={<Login/>} />
          <Route path="/profile"  element={<Profile/>} />
          <Route path="/messages"  element={<Messages/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
