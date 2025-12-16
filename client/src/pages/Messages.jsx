import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Messages() {
    const { user } = useAuth();
    const { adId, userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeChat, setActiveChat] = useState(null); // { ad, otherUser }
    const messagesEndRef = useRef(null);

    // Initial Load: Get all conversations
    useEffect(() => {
        fetchConversations();
    }, []);

    // If params exist (direct access from Ad), set active chat
    useEffect(() => {
        if (adId && userId) {
            const initializeChat = async () => {
                let adData = location.state?.ad;

                // If state is missing (e.g. refresh), fetch details
                if (!adData) {
                    try {
                        const res = await axios.get(`/api/ads/${adId}`);
                        adData = res.data;
                    } catch (err) {
                        console.error("Error fetching ad details:", err);
                    }
                }

                if (adData) {
                    // Normalize seller data structure depending on how it's returned
                    const sellerName = adData.seller?.username || 'Vendeur';

                    setActiveChat({
                        ad: adData,
                        otherUser: { uuid: userId, username: sellerName }
                    });

                    fetchMessages(userId, adId);
                }
            };

            initializeChat();
        }
    }, [adId, userId]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('/api/messages/conversations');
            setConversations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async (otherId, aId) => {
        try {
            const res = await axios.get(`/api/messages/${otherId}/${aId}`);
            setMessages(res.data);
            scrollToBottom();
        } catch (err) {
            console.error(err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const res = await axios.post('/api/messages', {
                adId: activeChat.ad.uuid,
                receiverId: activeChat.otherUser.uuid,
                content: newMessage
            });

            setMessages([...messages, res.data]);
            setNewMessage('');
            scrollToBottom();
            fetchConversations();
        } catch (err) {
            console.error(err);
            alert('Failed to send message');
        }
    };

    const selectConversation = (conv) => {
        setActiveChat({ ad: conv.ad, otherUser: conv.otherUser });
        navigate(`/messages/${conv.ad.uuid}/${conv.otherUser.uuid}`);
        fetchMessages(conv.otherUser.uuid, conv.ad.uuid);
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '1rem' }}>
            {/* Sidebar List */}
            <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageCircle size={20} /> Discussions
                    </h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Aucune conversation.</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={`${conv.ad.uuid}-${conv.otherUser.uuid}`}
                                onClick={() => selectConversation(conv)}
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    background: activeChat?.ad?.uuid === conv.ad.uuid && activeChat?.otherUser?.uuid === conv.otherUser.uuid ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>{conv.otherUser.username}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{conv.ad.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {conv.lastMessage.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {activeChat ? (
                    <>
                        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                            <strong>{activeChat.otherUser.username}</strong>
                            <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>•</span>
                            <span style={{ color: 'var(--accent)' }}>{activeChat.ad.title}</span>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {messages.map((msg) => {
                                const isMe = msg.senderId === user.uuid;
                                return (
                                    <div key={msg.uuid} style={{
                                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%',
                                        background: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        padding: '0.75rem',
                                        borderRadius: '1rem',
                                        borderBottomRightRadius: isMe ? '0' : '1rem',
                                        borderBottomLeftRadius: isMe ? '1rem' : '0'
                                    }}>
                                        <div>{msg.content}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                className="input"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                style={{ margin: 0 }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem' }}>
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Selectionnez une conversation pour commencer
                    </div>
                )}
            </div>
        </div>
    );
}
