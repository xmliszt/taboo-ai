interface ResponseDisplayProps {
  message: string;
  highlights: number[];
}

export default function ResponseDisplay(props: ResponseDisplayProps) {
  return (
    <section className="w-full flex justify-center items-center text-5xl px-6">
      <p className="transition-opacity">{props.message}</p>
    </section>
  );
}
