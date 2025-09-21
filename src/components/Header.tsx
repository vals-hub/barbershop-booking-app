import { NavLink } from 'react-router-dom';

export const Header = () => (
  <header className="app-header">
    <div className="app-header__brand">
      <span className="app-logo">Barberhood</span>
      <p className="app-subtitle">Κράτησε ραντεβού χωρίς τηλέφωνα</p>
    </div>
    <nav className="app-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        Αρχική
      </NavLink>
      <NavLink to="/book" className={({ isActive }) => (isActive ? 'active' : '')}>
        Κλείσε ραντεβού
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
        Dashboard κουρέα
      </NavLink>
    </nav>
  </header>
);

export default Header;
