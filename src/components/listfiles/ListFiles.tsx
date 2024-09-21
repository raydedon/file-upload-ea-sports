import { listS3Files } from '../../app/lib/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFileIcon } from '../../utils/utils';
import Image from 'next/image';

const S3Files = async () => {
    const fileList = await listS3Files();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Files in S3 Bucket</h1>
            <div className="grid grid-cols-4 gap-4 font-semibold bg-gray-100 p-2">
                <div>File Type</div>
                <div>File Name</div>
                <div>Size (KB)</div>
                <div>Uploaded</div>
            </div>

            {fileList.map((file, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 border-b border-gray-200 p-2 items-center">
                    <div>
                        {(file?.mimeType as string)?.startsWith('image/') && file?.preSignedUrl ? (
                            <Image
                                src={file?.preSignedUrl}
                                alt={file.key!}
                                className="w-12 h-12 object-cover rounded"
                                width={50}
                                height={50}
                            />
                        ) : (
                            <FontAwesomeIcon icon={getFileIcon(file.mimeType as string)} size="lg" />
                        )}
                    </div>
                    <div>{file.key}</div>
                    <div>{(file.size! / 1024).toFixed(2)} KB</div>
                    <div>{new Date(file.lastModified!).toLocaleDateString()}</div>
                </div>
            ))}
        </div>

    );
}

export default S3Files;