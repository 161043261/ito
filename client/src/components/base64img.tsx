import { genBase64Img } from '@/utils/img';

interface IProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function Base64Img(props: IProps) {
  const { src, alt, className } = props;
  return (
    <img
      src={src.length ? src : genBase64Img()}
      onError={(ev) => (ev.currentTarget.src = genBase64Img())}
      alt={alt ?? 'img'}
      className={className}
      draggable={false}
    />
  );
}
