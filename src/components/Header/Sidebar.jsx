import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBookOpen, FiUser, FiSettings, FiX, FiLogOut } from 'react-icons/fi';
import styles from './Sidebar.module.css';

const navItems = [
    { to: '/instructor/dashboard', icon: <FiHome />, label: 'Dashboard' },
    //   { to: '/lessons',   icon: <FiBookOpen />,  label: 'Lessen' },
    //   { to: '/students',  icon: <FiUser />,      label: 'Studenten' },
    //   { to: '/settings',  icon: <FiSettings />,  label: 'Instellingen' },
];

const Sidebar = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsOpen(open => !open);
        window.addEventListener('toggleSidebar', handleToggle);
        return () => window.removeEventListener('toggleSidebar', handleToggle);
    }, []);

    return (
        // <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <aside
            className={styles.sidebar}
            style={{
                transform: isOpen
                    ? 'translateX(0)'
                    : 'translateX(100%)',
                transition: 'transform 0.3s ease'
            }}
        >
            <div className={styles.header}>
                <button
                    className={styles.closeBtn}
                    onClick={() => setIsOpen(false)}
                    aria-label="Close sidebar"
                >
                    <FiX size={24} />
                </button>
            </div>

            <nav className={styles.nav}>
                {navItems.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={styles.navItem}
                        activeClassName={styles.active}
                        onClick={() => setIsOpen(false)}
                    >
                        <span className={styles.icon}>{icon}</span>
                        <span className={styles.label}>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* mobile‐only logout */}
            <button
                className={styles.logoutMobile}
                onClick={() => {
                    setIsOpen(false);
                    onLogout();
                }}
            >
                <FiLogOut size={18} style={{ marginRight: 8 }} />
                Uitloggen
            </button>
        </aside>
    );
};

export default Sidebar;
