import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, MessageCircle } from 'lucide-react';

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

            // Mark as read
            await axios.put('/api/messages/read', {
                adId: aId,
                senderId: otherId
            });
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
            console.log("Sending message...", {
                adId: activeChat.ad.uuid,
                receiverId: activeChat.otherUser.uuid,
                content: newMessage
            });

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
            console.error("Send message error:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to send message';
            alert(`Erreur: ${errorMsg}`);
        }
    };

    const selectConversation = (conv) => {
        setActiveChat({ ad: conv.ad, otherUser: conv.otherUser });
        navigate(`/messages/${conv.ad.uuid}/${conv.otherUser.uuid}`);
        fetchMessages(conv.otherUser.uuid, conv.ad.uuid);
    };

    return (
        <div className="chat-container">
            {/* Sidebar List */}
            <div className="glass-panel chat-sidebar">
                <div style={{ padding: '1rem', borderBottom: '1px solid #E0E0E0' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        <MessageCircle size={20} /> Discussions
                    </h2>
                </div>
                <div className="chat-list">
                    {conversations.length === 0 ? (
                        <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Aucune conversation.</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={`${conv.ad.uuid}-${conv.otherUser.uuid}`}
                                onClick={() => selectConversation(conv)}
                                className={`chat-item ${activeChat?.ad?.uuid === conv.ad.uuid && activeChat?.otherUser?.uuid === conv.otherUser.uuid ? 'active' : ''}`}
                            >
                                <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>{conv.otherUser.username}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666666' }}>{conv.ad.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#999999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {conv.lastMessage.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="glass-panel chat-window">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <strong style={{ textTransform: 'uppercase' }}>{activeChat.otherUser.username}</strong>
                            <span style={{ margin: '0 0.5rem', color: '#E0E0E0' }}>|</span>
                            <span style={{ color: '#666666', fontSize: '0.9rem' }}>{activeChat.ad.title}</span>
                        </div>

                        <div className="messages-list">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === user.uuid;
                                return (
                                    <div key={msg.uuid} className={`message-bubble ${isMe ? 'me' : 'other'}`}>
                                        <div>{msg.content}</div>
                                        <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="chat-input-area">
                            <input
                                className="input-field"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                style={{ margin: 0 }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999999', flexDirection: 'column', gap: '1rem' }}>
                        <MessageCircle size={48} style={{ opacity: 0.2 }} />
                        <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </div>
        </div>
    );
}
