import { Outlet } from "react-router";
import { Header } from "../shared/Header";
import { Navbar } from "../shared/Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <Outlet />
    </div>
  );
}
