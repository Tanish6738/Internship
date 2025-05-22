import { Route, Routes } from "react-router-dom"
import Navbar from "../components/Navbar"
import Layout from "../components/Layout"
import Home from "../Pages/Home"
import About from "../Pages/About"
import Cart from "../Pages/Cart"
import FloatingCart from "../components/FloatingCart"

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <FloatingCart />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
      </Routes>
    </>
  )
}

export default AppRoutes