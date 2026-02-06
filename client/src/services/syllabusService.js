import api from './api';

const uploadSyllabus = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    };

    const response = await api.post('/syllabus/upload', formData, config);
    return response.data;
};

const getSyllabi = async () => {
    const response = await api.get('/syllabus');
    return response.data;
};

const getSyllabusById = async (id) => {
    const response = await api.get(`/syllabus/${id}`);
    return response.data;
};

const syllabusService = {
    uploadSyllabus,
    getSyllabi,
    getSyllabusById
};

export default syllabusService;
