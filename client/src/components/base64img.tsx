import { genBase64 } from '@/utils/img';

interface IProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ImgBox(props: IProps) {
  const { src, alt, className } = props;
  return (
    <img
      src={src}
      onError={(ev) => {
        console.error('avatar error');
        ev.currentTarget.src = genBase64();
      }}
      alt={alt ?? 'img'}
      className={className}
      draggable={false}
    />
  );
}
