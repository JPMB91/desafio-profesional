import { Outlet } from "react-router-dom"
import { Header } from "../Components/Header/Header"
import { Footer } from "../Components/Footer"


export const Layout = () => {
  return (
    <div className="App">
     <Header />
     <Outlet />
     <Footer />
    </div>
  )
}
