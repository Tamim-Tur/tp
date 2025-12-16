import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EditAd() {
    const { uuid } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`/api/ads/${uuid}`)
            .then(res => {
                const ad = res.data;
                // Security check
                if (user && ad.userId !== (user.uuid || user.userId)) {
                    navigate('/'); // Redirect if not owner
                    return;
                }

                setFormData({
                    title: ad.title,
                    description: ad.description,
                    price: ad.price
                });
                setCurrentImageUrl(ad.imageUrl);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Impossible de charger l'annonce");
                setLoading(false);
            });
    }, [uuid, user, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Seuls les fichiers JPG et PNG sont acceptés');
                return;
            }
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

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            // Ensure price is a valid number, otherwise let Zod handle error but don't crash
            const price = parseFloat(formData.price);
            if (!isNaN(price)) {
                formDataToSend.append('price', price);
            } else {
                formDataToSend.append('price', formData.price); // Let backend validate
            }

            // Only append image if a new one is selected
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            await axios.put(`/api/ads/${uuid}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/account');
        } catch (err) {
            console.error("Update error:", err);
            if (err.response?.data?.errors) {
                // Formatting Zod errors
                setError(err.response.data.errors.map(e => `${e.path}: ${e.message}`).join(', '));
            } else {
                setError(err.response?.data?.message || 'Erreur lors de la modification');
            }
        }
    };

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.")) return;
        try {
            await axios.delete(`/api/ads/${uuid}`);
            navigate('/account');
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Chargement...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }} className="glass-panel">
            <div style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center', textTransform: 'uppercase', fontWeight: '900' }}>Modifier l'annonce</h2>
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
                        />
                        <p style={{ fontSize: '0.75rem', color: '#666666', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            Laisser vide pour conserver l'image actuelle
                        </p>

                        {(imagePreview || currentImageUrl) && (
                            <div style={{ marginTop: '1rem', border: '1px solid #E0E0E0', padding: '0.5rem', borderRadius: '4px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Aperçu :</p>
                                <img
                                    src={imagePreview || currentImageUrl}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Enregistrer les modifications
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="btn"
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                border: '1px solid #FF0000',
                                color: '#FF0000',
                                background: 'transparent'
                            }}
                        >
                            Supprimer l'annonce
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
