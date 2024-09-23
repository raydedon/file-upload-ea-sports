// app/page.tsx
'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { fileUploadFormData } from '../../app/lib/actions';
import TwButton from '../button/TwButton';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('File size exceeds the 5MB limit');
                setSelectedFile(null); // Reset the selected file
            } else {
                setErrorMessage(undefined);
                setSelectedFile(file);
            }
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            setErrorMessage(undefined);
        const formData = new FormData();
        formData.append('file', selectedFile);
        await fileUploadFormData(formData)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            setErrorMessage('Error uploading file');
        } finally {
            setIsUploading(false); // Re-enable form and button
        }
    };

    return (
        <div>
            <h1>Upload a File (Max 5MB)</h1>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                <input type="file" onChange={handleFileChange} disabled={isUploading}/>
                <TwButton type="submit" disabled={!selectedFile}
                          loading={isUploading}
                          className="text-white bg-blue-400 dark:bg-blue-500 font-medium rounded-lg text-sm px-5 py-2 text-center">
                    Upload
                </TwButton>
                {errorMessage && <p style={{ color: 'red', gridRow: '1/3' }}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default FileUpload;