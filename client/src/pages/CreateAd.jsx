import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

export default function CreateAd() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Seuls les fichiers JPG et PNG sont acceptés');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La taille du fichier ne doit pas dépasser 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            setError('Veuillez sélectionner une image');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', parseFloat(formData.price));
            formDataToSend.append('image', imageFile);

            await axios.post('/api/ads', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (err) {
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.map(e => e.message).join(', '));
            } else {
                setError(err.response?.data?.message || 'Erreur lors de la création');
            }
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }} className="glass-panel">
            <div style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center', textTransform: 'uppercase', fontWeight: '900' }}>Déposer une annonce</h2>
                {error && <div style={{ border: '1px solid #FF0000', color: '#FF0000', background: '#FFFFFF', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 'bold' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Titre</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Prix (€)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                            <Upload size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                            Image (JPG ou PNG)
                        </label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="input-field"
                            style={{ padding: '0.5rem' }}
                            required
                        />
                        <p style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            Formats acceptés: JPG, PNG (max 5MB)
                        </p>

                        {imagePreview && (
                            <div style={{ marginTop: '1rem', border: '1px solid #E0E0E0', padding: '0.5rem', borderRadius: '4px' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'contain',
                                        borderRadius: '2px'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Description</label>
                        <textarea
                            className="input-field"
                            rows="5"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Publier l'annonce</button>
                </form>
            </div>
        </div>
    );
}
