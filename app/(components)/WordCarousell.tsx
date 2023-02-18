const sizes = [
  'text-base lg:text-lg',
  'text-lg lg:text-2xl',
  'text-2xl lg:text-4xl',
  'text-3xl lg:text-7xl',
];

const words = [
  'Guitar',
  'Birthday',
  'Halloween',
  'Piano',
  'Diamond',
  'Bicycle',
  'Garden',
  'Summer',
  'Vacation',
  'Wedding',
  'Chocolate',
  'Pizza',
  'Carnival',
  'Zoo',
  'Beach',
  'Waterfall',
  'Volcano',
  'Fireworks',
  'Pirate',
  'Robot',
  'Dragon',
  'Vampire',
  'Werewolf',
  'Alien',
  'Ninja',
  'Superhero',
  'Witch',
  'Ghost',
  'Angel',
  'Unicorn',
  'Mermaid',
  'Fairy',
  'Elf',
  'Lion',
  'Elephant',
  'Giraffe',
  'Kangaroo',
  'Penguin',
  'Bear',
  'Snake',
  'Crocodile',
  'Shark',
  'Whale',
  'Turtle',
  'Octopus',
  'Butterfly',
  'Ladybug',
  'Ant',
  'Bee',
  'Bird',
];

const animationClasses = [
  'animate-[moveIn_15s_linear_infinite]',
  'animate-[moveIn_16s_linear_infinite]',
  'animate-[moveIn_17s_linear_infinite]',
  'animate-[moveIn_18s_linear_infinite]',
  'animate-[moveIn_19s_linear_infinite]',
  'animate-[moveIn_20s_linear_infinite]',
  'animate-[moveIn_21s_linear_infinite]',
  'animate-[moveIn_22s_linear_infinite]',
  'animate-[moveIn_23s_linear_infinite]',
  'animate-[moveIn_24s_linear_infinite]',
  'animate-[moveIn_25s_linear_infinite]',
  'animate-[moveIn_26s_linear_infinite]',
  'animate-[moveIn_27s_linear_infinite]',
  'animate-[moveIn_28s_linear_infinite]',
  'animate-[moveIn_29s_linear_infinite]',
  'animate-[moveIn_30s_linear_infinite]',
  'animate-[moveIn_31s_linear_infinite]',
  'animate-[moveIn_32s_linear_infinite]',
  'animate-[moveIn_33s_linear_infinite]',
  'animate-[moveIn_34s_linear_infinite]',
  'animate-[moveIn_35s_linear_infinite]',
  'animate-[moveIn_36s_linear_infinite]',
  'animate-[moveIn_37s_linear_infinite]',
  'animate-[moveIn_38s_linear_infinite]',
  'animate-[moveIn_39s_linear_infinite]',
  'animate-[moveIn_40s_linear_infinite]',
  'animate-[moveIn_41s_linear_infinite]',
  'animate-[moveIn_42s_linear_infinite]',
  'animate-[moveIn_43s_linear_infinite]',
  'animate-[moveIn_44s_linear_infinite]',
  'animate-[moveIn_45s_linear_infinite]',
  'animate-[moveIn_46s_linear_infinite]',
  'animate-[moveIn_47s_linear_infinite]',
  'animate-[moveIn_48s_linear_infinite]',
  'animate-[moveIn_49s_linear_infinite]',
  'animate-[moveIn_50s_linear_infinite]',
  'animate-[moveIn_51s_linear_infinite]',
  'animate-[moveIn_52s_linear_infinite]',
  'animate-[moveIn_53s_linear_infinite]',
  'animate-[moveIn_54s_linear_infinite]',
  'animate-[moveIn_55s_linear_infinite]',
  'animate-[moveIn_56s_linear_infinite]',
  'animate-[moveIn_57s_linear_infinite]',
  'animate-[moveIn_58s_linear_infinite]',
  'animate-[moveIn_59s_linear_infinite]',
  'animate-[moveIn_60s_linear_infinite]',
  'animate-[moveIn_61s_linear_infinite]',
  'animate-[moveIn_62s_linear_infinite]',
  'animate-[moveIn_63s_linear_infinite]',
  'animate-[moveIn_64s_linear_infinite]',
  'animate-[moveIn_65s_linear_infinite]',
  'animate-[moveIn_66s_linear_infinite]',
];

const getAnimationClass = (): string => {
  return animationClasses[Math.floor(Math.random() * animationClasses.length)];
};

const getOpacityAndBlurClass = (size: string): string => {
  if (size === 'text-base lg:text-lg') {
    return 'opacity-[7%] blur-xxxxs';
  }
  if (size === 'text-lg lg:text-2xl') {
    return 'opacity-[10%] blur-xxxs';
  }
  if (size === 'text-2xl lg:text-4xl') {
    return 'opacity-[12%] blur-xxs';
  }
  if (size === 'text-3xl lg:text-7xl') {
    return 'opacity-[15%] blur-xs';
  }
  return 'opacity-10 blur-xxxxs';
};

let cache: JSX.Element[];

export default function WordCarousell() {
  let wordsElements: JSX.Element[];
  if (cache) {
    wordsElements = [...cache];
  } else {
    wordsElements = words.map((word) => {
      const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
      const animationClass = getAnimationClass();
      const opacityBlurClass = getOpacityAndBlurClass(sizeClass);
      return (
        <div
          key={word}
          className={`${animationClass} ${opacityBlurClass} ${sizeClass} w-full`}
        >
          {word}
        </div>
      );
    });
    cache = wordsElements;
  }
  return (
    <div className='fixed top-0 h-full w-full leading-normal font-extrabold font-serif pointer-events-none'>
      {wordsElements}
    </div>
  );
}
