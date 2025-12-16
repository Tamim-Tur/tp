import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut, PlusCircle, User, LogIn, MessageCircle } from 'lucide-react';

const NotificationBadge = () => {
    const [count, setCount] = useState(0);

    const fetchCount = async () => {
        try {
            const res = await axios.get('/api/messages/unread-count');
            setCount(res.data.count);
        } catch (err) {
            console.error("Failed to fetch notification count", err);
        }
    };

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <Link to="/messages" className="btn" style={{ background: 'transparent', color: 'var(--text)', padding: '0.5rem', position: 'relative' }} title="Mes messages">
            <MessageCircle size={20} />
            {count > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    minWidth: '18px',
                    textAlign: 'center'
                }}>
                    {count}
                </span>
            )}
        </Link>
    );
};

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="glass-panel no-hover" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            marginBottom: '2rem',
            marginTop: '0',
            position: 'sticky',
            top: '0',
            borderRadius: '0 0 1rem 1rem',
            zIndex: 50
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                <ShoppingBag />
                <span>CoinCoin</span>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/create-ad" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                            <PlusCircle size={20} />
                            Déposer une annonce
                        </Link>
                        <NotificationBadge />
                        <Link to="/account" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', textDecoration: 'none' }}>
                            <User size={20} />
                            <span>{user.username}</span>
                        </Link>
                        <button onClick={logout} className="btn" style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Connexion</Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogIn size={20} />
                            Inscription
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
