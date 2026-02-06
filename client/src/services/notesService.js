import api from './api';

const generateNotes = async (syllabusId) => {
    const response = await api.post('/notes/generate', { syllabusId });
    return response.data;
};

const getNotes = async (syllabusId) => {
    const response = await api.get(`/notes/syllabus/${syllabusId}`);
    return response.data;
};

const notesService = {
    generateNotes,
    getNotes
};

export default notesService;
