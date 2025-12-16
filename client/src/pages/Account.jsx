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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#000000', textTransform: 'uppercase', fontWeight: '900', textAlign: 'center', letterSpacing: '-1px' }}>
                Mon Compte
            </h1>

            {/* Profile Card */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #000000' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={40} color="white" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{profile?.username}</h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#666666', fontSize: '0.9rem' }}>{profile?.email}</p>
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
                        background: activeTab === 'purchases' ? '#000000' : 'transparent',
                        color: activeTab === 'purchases' ? '#FFFFFF' : '#000000',
                        border: '1px solid #000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'none'
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
                        background: activeTab === 'sales' ? '#000000' : 'transparent',
                        color: activeTab === 'sales' ? '#FFFFFF' : '#000000',
                        border: '1px solid #000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'none'
                    }}
                >
                    <Package size={20} />
                    Mes Ventes ({sales.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === 'purchases' && (
                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Mes Achats</h3>
                    {purchases.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', border: '1px solid #E0E0E0' }}>
                            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.2, color: '#000000' }} />
                            <p style={{ color: '#666666' }}>Vous n'avez pas encore effectué d'achat</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {purchases.map((purchase, i) => (
                                <div
                                    key={purchase.uuid}
                                    className="glass-panel"
                                    style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', border: '1px solid #E0E0E0' }}
                                >
                                    {purchase.ad?.imageUrl && (
                                        <img
                                            src={purchase.ad.imageUrl}
                                            alt={purchase.ad.title}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #000000' }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{purchase.ad?.title}</h4>
                                        <p style={{ color: '#666666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                                            {purchase.ad?.description?.substring(0, 100)}...
                                        </p>
                                        <p style={{ color: '#000000', margin: '0.5rem 0', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            VENDEUR: <span style={{ fontWeight: 'normal' }}>{purchase.ad?.seller?.username}</span>
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#000000', fontWeight: '900', fontSize: '1.1rem' }}>
                                                {purchase.amount} €
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666666', fontSize: '0.8rem' }}>
                                                <Calendar size={14} />
                                                {new Date(purchase.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span style={{
                                                marginLeft: 'auto',
                                                border: '1px solid #000000',
                                                color: '#000000',
                                                padding: '0.25rem 0.75rem',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}>
                                                {purchase.status === 'completed' ? 'ACHETÉ' : purchase.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'sales' && (
                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Mes Ventes</h3>
                    {sales.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', border: '1px solid #E0E0E0' }}>
                            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.2, color: '#000000' }} />
                            <p style={{ color: '#666666' }}>Vous n'avez pas encore créé d'annonce</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sales.map((sale, i) => (
                                <div
                                    key={sale.uuid}
                                    className="glass-panel"
                                    style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', border: '1px solid #E0E0E0' }}
                                >
                                    {sale.imageUrl && (
                                        <img
                                            src={sale.imageUrl}
                                            alt={sale.title}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #000000' }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{sale.title}</h4>
                                        <p style={{ color: '#666666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                                            {sale.description.substring(0, 100)}...
                                        </p>
                                        {sale.Transaction && (
                                            <p style={{ color: '#000000', margin: '0.5rem 0', fontSize: '0.8rem' }}>
                                                ACHETEUR: <span style={{ fontWeight: 'bold' }}>{sale.Transaction.buyer?.username}</span>
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#000000', fontWeight: '900', fontSize: '1.1rem' }}>
                                                <Euro size={18} />
                                                {sale.price} €
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666666', fontSize: '0.8rem' }}>
                                                <Calendar size={14} />
                                                {new Date(sale.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span style={{
                                                marginLeft: 'auto',
                                                border: sale.status === 'sold' ? '1px solid #FF0000' : '1px solid #000000',
                                                color: sale.status === 'sold' ? '#FF0000' : '#000000',
                                                padding: '0.25rem 0.75rem',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}>
                                                {sale.status === 'sold' ? 'VENDU' : 'EN VENTE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
