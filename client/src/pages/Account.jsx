import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, User, Calendar, Euro } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
    const [activeTab, setActiveTab] = useState('purchases');
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        Promise.all([
            axios.get('/api/user/profile'),
            axios.get('/api/user/purchases'),
            axios.get('/api/user/sales')
        ])
            .then(([profileRes, purchasesRes, salesRes]) => {
                setProfile(profileRes.data);
                setPurchases(purchasesRes.data);
                setSales(salesRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching account data:', err);
                setLoading(false);
            });
    }, [user, navigate]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Chargement...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Mon Compte
            </h1>

            {/* Profile Card */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={30} color="white" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{profile?.username}</h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>{profile?.email}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('purchases')}
                    className="btn"
                    style={{
                        flex: 1,
                        background: activeTab === 'purchases' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <ShoppingBag size={20} />
                    Mes Achats ({purchases.length})
                </button>
                <button
                    onClick={() => setActiveTab('sales')}
                    className="btn"
                    style={{
                        flex: 1,
                        background: activeTab === 'sales' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Package size={20} />
                    Mes Ventes ({sales.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === 'purchases' && (
                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Mes Achats</h3>
                    {purchases.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p style={{ color: 'var(--text-muted)' }}>Vous n'avez pas encore effectué d'achat</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {purchases.map((purchase, i) => (
                                <motion.div
                                    key={purchase.uuid}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-panel"
                                    style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}
                                >
                                    {purchase.ad?.imageUrl && (
                                        <img
                                            src={purchase.ad.imageUrl}
                                            alt={purchase.ad.title}
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '0.5rem' }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{purchase.ad?.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                                            Vendeur: {purchase.ad?.seller?.username}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4ade80', fontWeight: 'bold' }}>
                                                <Euro size={18} />
                                                {purchase.amount} €
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                <Calendar size={16} />
                                                {new Date(purchase.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span style={{ marginLeft: 'auto', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem' }}>
                                                {purchase.status === 'completed' ? 'Complété' : purchase.status}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'sales' && (
                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Mes Ventes</h3>
                    {sales.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p style={{ color: 'var(--text-muted)' }}>Vous n'avez pas encore créé d'annonce</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sales.map((sale, i) => (
                                <motion.div
                                    key={sale.uuid}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-panel"
                                    style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}
                                >
                                    {sale.imageUrl && (
                                        <img
                                            src={sale.imageUrl}
                                            alt={sale.title}
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '0.5rem' }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{sale.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                                            {sale.description.substring(0, 100)}...
                                        </p>
                                        {sale.Transaction && (
                                            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                                                Acheteur: {sale.Transaction.buyer?.username}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4ade80', fontWeight: 'bold' }}>
                                                <Euro size={18} />
                                                {sale.price} €
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                <Calendar size={16} />
                                                {new Date(sale.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span style={{
                                                marginLeft: 'auto',
                                                background: sale.status === 'sold' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                color: sale.status === 'sold' ? '#f87171' : '#4ade80',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.875rem'
                                            }}>
                                                {sale.status === 'sold' ? 'Vendu' : 'En vente'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
