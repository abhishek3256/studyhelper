import React, { useState, useCallback } from 'react';
import { Upload, File, X, Check } from 'lucide-react';
import syllabusService from '../../services/syllabusService';

const UploadSection = ({ onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file) => {
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            setError('File size must be less than 10MB');
            return false;
        }
        return true;
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError(null);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
            }
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            await syllabusService.uploadSyllabus(file, (event) => {
                const percent = Math.round((event.loaded * 100) / event.total);
                setProgress(percent);
            });
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
            setUploading(false);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
    };

    return (
        <div className="w-full mb-8">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-colors duration-200 text-center ${dragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-slate-800/50'
                        : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!file ? (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-slate-700 rounded-full">
                                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                            Upload your syllabus
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Drag and drop your PDF here, or click to browse
                        </p>
                        <input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            accept=".pdf"
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="file-upload"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
                        >
                            Browse Files
                        </label>
                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg max-w-sm w-full mb-4">
                            <div className="p-2 bg-white dark:bg-slate-600 rounded">
                                <File className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                                disabled={uploading}
                            >
                                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {uploading && (
                            <div className="w-full max-w-sm mb-4">
                                <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-center mt-1 text-gray-500">{progress}% Uploading...</p>
                            </div>
                        )}

                        {!uploading && (
                            <button
                                onClick={handleUpload}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                Process Syllabus
                            </button>
                        )}
                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadSection;
