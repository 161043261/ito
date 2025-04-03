import useToast from '@/hooks/use_toast';
import { useState } from 'react';

interface IProps {
  onUploadOk: (filePath: string) => void; // 图片上传成功的回调
  onUploadErr?: (filePath: string) => void; // 图片上传失败的回调
  placeholder?: React.ReactNode;
}
const ImgUploader: React.FC<IProps> = (props) => {
  const { onUploadOk, onUploadErr, placeholder } = props;
  const toast = useToast();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleUpload = async (options: { file: any }) => {
    setIsLoading(true);
    const file = options.file;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过 10M');
      setIsLoading(false);
      return;
    }
    try {
      // todo @/utils/upload_file.ts
    } catch (err) {
      console.error(err);
    }
  };
  return <div></div>;
};

export default ImgUploader;
