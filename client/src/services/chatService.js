import api from './api';

const getChatHistory = async (syllabusId) => {
    const response = await api.get(`/chat/${syllabusId}`);
    return response.data;
};

const sendMessage = async (syllabusId, message) => {
    const response = await api.post('/chat/message', { syllabusId, message });
    return response.data;
};

const chatService = {
    getChatHistory,
    sendMessage
};

export default chatService;
