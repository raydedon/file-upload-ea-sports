import FileUpload from '../components/fileupload/FileUpload';
import S3Files from '../components/listfiles/ListFiles';

export default function Home() {
  return (
      <div className="flex flex-col h-screen overflow-hidden">
        <FileUpload/>
        <S3Files/>
      </div>
  );
}
