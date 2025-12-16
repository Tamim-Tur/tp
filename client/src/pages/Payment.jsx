import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Payment() {
    const { adId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const adData = location.state?.ad; // Pass ad data via state to avoid refetching

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    // If accessed directly without state, we might need to fetch ad details (omitted for brevity, assuming access via Home)
    if (!adId) return <div>Erreur: Aucune annonce spécifiée.</div>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post('/api/transactions/purchase', {
                adId,
                ...formData
            });
            setMessage({ type: 'success', text: `Paiement réussi pour "${res.data.item}" !` });
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Erreur lors du paiement';
            const validationErrors = error.response?.data?.errors;

            if (validationErrors) {
                setMessage({ type: 'error', text: validationErrors.map(e => e.message).join(', ') });
            } else {
                setMessage({ type: 'error', text: errorMsg });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex justify-center"
            style={{ maxWidth: '600px', margin: '2rem auto' }}
        >
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid #000000' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: '#000000', padding: '0.75rem', borderRadius: '50%', color: 'white' }}>
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, textTransform: 'uppercase', fontWeight: '900' }}>Paiement Sécurisé</h2>
                        {adData && <p style={{ margin: 0, color: '#666666' }}>Montant à payer: <span style={{ color: '#000000', fontWeight: 'bold' }}>{adData.price} €</span></p>}
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '4px',
                        marginBottom: '1.5rem',
                        background: '#FFFFFF',
                        color: message.type === 'error' ? '#FF0000' : '#000000',
                        border: `1px solid ${message.type === 'error' ? '#FF0000' : '#000000'}`,
                        fontWeight: 'bold'
                    }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                            <span>{message.text}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Nom du titulaire</label>
                        <input
                            type="text"
                            name="cardHolderName"
                            className="input-field"
                            value={formData.cardHolderName}
                            onChange={handleChange}
                            placeholder="JEAN DUPONT"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Numéro de carte</label>
                        <div style={{ position: 'relative' }}>
                            <CreditCard size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#000000' }} />
                            <input
                                type="text"
                                name="cardNumber"
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.cardNumber}
                                onChange={handleChange}
                                placeholder="0000 0000 0000 0000"
                                maxLength="16"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Expiration (MM/YY)</label>
                            <input
                                type="text"
                                name="expiryDate"
                                className="input-field"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                placeholder="12/25"
                                maxLength="5"
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                className="input-field"
                                value={formData.cvv}
                                onChange={handleChange}
                                placeholder="123"
                                maxLength="4"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '1rem', padding: '1rem', width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? 'Traitement en cours...' : `Payer ${adData?.price ? adData.price + ' €' : ''}`}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.7rem', color: '#666666', textTransform: 'uppercase' }}>
                    <Lock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-top' }} />
                    Toutes les transactions sont sécurisées et chiffrées.
                </div>
            </div>
        </div>
    );
}
