import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';

export const getFileIcon = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return faFileImage;
    if (mimeType === 'application/pdf') return faFilePdf;
    if (mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return faFileWord;
    return faFileAlt; // Default file icon
};