'use client';

import { useEffect, useState } from 'react';
import { getRandomInt } from '../../lib/utilities';

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
  'animate-carousell-10',
  'animate-carousell-12',
  'animate-carousell-14',
  'animate-carousell-16',
  'animate-carousell-18',
  'animate-carousell-20',
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

const wordDensity = 20;

export default function WordCarousell() {
  const [hasDisplayed, setHasDisplayed] = useState(false);
  useEffect(() => {
    if (!hasDisplayed) {
      displayCarousell();
      setHasDisplayed(true);
    }
  }, [hasDisplayed]);

  const displayCarousell = () => {
    const wordCarousellContainer = document.getElementById(
      'word-carousell-container'
    );
    if (wordCarousellContainer) {
      for (let i = 0; i < wordDensity; i++) {
        delayRender(i, wordCarousellContainer, getRandomInt(0, 1000) / 100);
      }
    }
  };

  const delayRender = async (
    index: number,
    container: HTMLElement,
    delay: number
  ) => {
    return new Promise<void>((res) => {
      setTimeout(() => {
        const word = words[Math.floor(Math.random() * words.length)];
        const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
        const opacityBlurClass = getOpacityAndBlurClass(sizeClass);
        const animationClass = getAnimationClass();
        const wordElement = document.createElement('div');
        wordElement.classList.add('w-full');
        wordElement.classList.add(animationClass);
        sizeClass.split(' ').forEach((cls) => wordElement.classList.add(cls));
        opacityBlurClass
          .split(' ')
          .forEach((cls) => wordElement.classList.add(cls));
        wordElement.setAttribute('key', String(index));
        wordElement.innerHTML = word;
        container.appendChild(wordElement);
        res();
      }, delay * 1000);
    });
  };

  return (
    <div
      id='word-carousell-container'
      className='fixed top-0 h-full w-full leading-normal font-extrabold font-serif pointer-events-none -z-10'
    ></div>
  );
}
