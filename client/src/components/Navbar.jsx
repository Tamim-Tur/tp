import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LogOut, PlusCircle, User, LogIn, MessageCircle } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="glass-panel" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            marginBottom: '2rem',
            marginTop: '1rem'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                <ShoppingBag />
                <span>CoinCoin</span>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/create-ad" className="btn btn-primary">
                            <PlusCircle size={20} />
                            Déposer une annonce
                        </Link>
                        <Link to="/messages" className="btn" style={{ background: 'transparent', color: 'var(--text)', padding: '0.5rem' }} title="Mes messages">
                            <MessageCircle size={20} />
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} />
                            <span>{user.username}</span>
                        </div>
                        <button onClick={logout} className="btn" style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn" style={{ color: 'white' }}>Connexion</Link>
                        <Link to="/register" className="btn btn-primary">
                            <LogIn size={20} />
                            Inscription
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
