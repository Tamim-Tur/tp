import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

export default function Home() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/ads').then(res => {
            setAds(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Chargement des annonces...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Dernières Annonces
            </h1>

            {ads.length === 0 ? (
                <p>Aucune annonce pour le moment. Soyez le premier !</p>
            ) : (
                <div className="grid-auto">
                    {ads.map((ad, i) => (
                        <motion.div
                            key={ad.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel"
                            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        >
                            {ad.imageUrl && (
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{ad.title}</h3>
                                    <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 'bold' }}>
                                        {ad.price} €
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', flex: 1, marginBottom: '1.5rem' }}>
                                    {ad.description.substring(0, 100)}...
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <Tag size={16} />
                                        <span>{ad.seller?.username || 'Anonyme'}</span>
                                    </div>
                                    <Link
                                        to={`/payment/${ad.uuid}`}
                                        state={{ ad }}
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                    >
                                        Acheter
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
