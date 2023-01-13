import styles from "./PlayerInputDisplay.module.css";

interface PlayerInputDisplayProps {
  inputMessage: String;
}

export default function PlayerInputDisplay(props: PlayerInputDisplayProps) {
  return (
    <section className="w-full flex justify-center items-center text-5xl px-6">
      <p className={styles.displayText}>{props.inputMessage}</p>
    </section>
  );
}
