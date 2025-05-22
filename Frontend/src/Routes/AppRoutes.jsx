import { Route, Routes } from "react-router-dom"
import Navbar from "../components/Navbar"
import Layout from "../components/Layout"
import Home from "../Pages/Home"
import About from "../Pages/About"
import Cart from "../Pages/Cart"
import Auth from "../Pages/Auth"
import Transaction from "../Pages/Transaction"
import Profile from "../Pages/Profile"
import FloatingCart from "../components/FloatingCart"
import Footer from "../components/Footer"

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <FloatingCart />      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/auth" element={<Layout>< Auth/></Layout>} />
        <Route path="/my-transactions" element={<Layout>< Transaction/></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default AppRoutes