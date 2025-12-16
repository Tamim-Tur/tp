import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/login'); // Redirect to login after register
        } catch (err) {
            // Check for array of errors from Zod
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.map(e => e.message).join(', '));
            } else {
                setError(err.response?.data?.message || 'Erreur d\'inscription');
            }
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '6rem auto' }} className="glass-panel">
            <div style={{ padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', textTransform: 'uppercase', fontWeight: '900' }}>Inscription</h2>
                {error && <div style={{ border: '1px solid #FF0000', color: '#FF0000', background: '#FFFFFF', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 'bold' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Nom d'utilisateur</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="Min 8 cars, 1 maj, 1 num, 1 special"
                            className="input-field"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        S'inscrire
                    </button>
                </form>
            </div>
        </div>
    );
}
