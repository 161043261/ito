import { genBase64 } from '@/utils/img';

interface IProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function RoundImg(props: IProps) {
  const { src, alt, className } = props;
  return (
    <img
      src={src}
      onError={(ev) => {
        // todo: Uncomment
        console.error('avatar error:', src);
        ev.currentTarget.src = genBase64();
      }}
      alt={alt ?? 'img'}
      className={`rounded-full ${className}`}
      draggable={false}
    />
  );
}
