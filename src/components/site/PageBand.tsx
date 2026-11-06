import Image from "next/image";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function PageBand({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
}: Props) {
  return (
    <section className="page-band relative pt-28">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
      ) : null}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        {eyebrow ? <p className="eyebrow text-gold-light">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sand-200/90 text-pretty">
            {description}
          </p>
        ) : null}
        <div className="divider-gold mt-10 max-w-xs" />
      </div>
    </section>
  );
}
