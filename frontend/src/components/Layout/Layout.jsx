import { NavLink } from 'react-router-dom';
import { 
  FaTasks, FaHome, FaCalendarAlt, FaCog, 
} from 'react-icons/fa';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" end>
              <FaHome className="icon" />
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks">
              <FaTasks className="icon" />
              <span className="menu-text">Tasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar">
              <FaCalendarAlt className="icon" />
              <span className="menu-text">Calendar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings">
              <FaCog className="icon" />
              <span className="menu-text">Settings</span>
            </NavLink>
          </li>
        </ul>
      </aside>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
