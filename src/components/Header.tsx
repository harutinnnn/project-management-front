import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
const Header: React.FC = () => {
  const { userName } = useAuth();
  return (
    <header className="glass-panel style-e74dd1f7">
      <div className="search-bar style-5331a550">
        <Search
          size={18}
          color="var(--text-muted)"
          className="style-b3847b37"
        />
        <input
          type="text"
          placeholder="Search something..."
          className="style-67081c63"
        />
      </div>

      <div className="header-actions style-62eecf9b">
        <button className="style-ecc54817">
          <Bell size={20} color="var(--text-main)" />
          <span className="style-f7805698" />
        </button>

        <div className="user-profile style-977ba781">
          <div className="style-428a803f">
            <User size={18} color="white" />
          </div>
          <div className="style-c30bfe5a">
            <span className="style-6b7db958">{userName ?? "User"}</span>
            <span className="style-ae369488">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
