import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container style-3ffe5c2b">
      <Sidebar />
      <div className="main-wrapper style-77c9e5ce">
        <Header />
        <main className="content-area style-e22d0f89">{children}</main>
      </div>
    </div>
  );
};
export default Layout;
