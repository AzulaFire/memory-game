'use client';
import MemoryCard from '@/components/MemoryCard';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWindowSize } from '@uidotdev/usehooks';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';

type Emoji = {
  htmlCode: string;
  name: string;
};

type Card = {
  name: string;
  index: number;
};

const categories = [
  'smileys-and-people',
  'animals-and-nature',
  'food-and-drink',
  'travel-and-places',
  'activities',
  'objects',
  'symbols',
  'flags',
];

const HomePage = () => {
  const { width, height } = useWindowSize();
  const [emojiData, setEmojiData] = useState<Emoji[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<Card[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [category, setCategory] = useState('');
  const [cards, setCards] = useState(0);

  console.log(isGameOver, matchedCards.length, emojiData.length);

  const handleCategorySelect = (value: string) => {
    setCategory(value);
  };

  const handleCardCount = (value: string) => {
    setCards(Number(value));
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      if (selectedCards[0].name === selectedCards[1].name) {
        setMatchedCards((prevMatchedCards) => [
          ...prevMatchedCards,
          ...selectedCards,
        ]);
      }
    }
  }, [selectedCards]);

  useEffect(() => {
    if (emojiData.length && matchedCards.length === emojiData.length) {
      setIsGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedCards]);

  useEffect(() => {
    if (category && cards > 0) {
      resetAll();
      startGame(); // Call without an event
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, cards]);

  const resetAll = () => {
    setSelectedCards([]);
    setMatchedCards([]);
    setIsGameOver(false);
    setCategory('');
    setCards(0);
    setEmojiData([]);
  };

  // Async function for starting the game
  async function startGame() {
    try {
      const response = await fetch(
        'https://emojihub.yurace.pro/api/all/category/' + category
      );
      if (response.ok) {
        // Optionally, handle the data returned by the API
        const data = await response.json();

        const randomData: Emoji[] = [];

        for (let i = 0; i < cards; i++) {
          const randomIndex = Math.floor(Math.random() * data.length);
          if (!randomData.includes(data[randomIndex])) {
            randomData.push(data[randomIndex]);
          } else {
            i--;
          }
        }

        // Step 1: Duplicate the array (each element twice)
        const duplicatedArray = randomData.reduce((acc, item) => {
          acc.push(item, item); // Push the item twice
          return acc;
        }, [] as Emoji[]);

        // Step 2: Shuffle the array using Fisher-Yates algorithm
        for (let i = duplicatedArray.length - 1; i > 0; i--) {
          // Generate a random index
          const randomIndex = Math.floor(Math.random() * (i + 1));

          // Swap elements at index i and randomIndex
          [duplicatedArray[i], duplicatedArray[randomIndex]] = [
            duplicatedArray[randomIndex],
            duplicatedArray[i],
          ];
        }

        setEmojiData(duplicatedArray);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error during fetch operation:', error);
    }
  }

  function turnCard(name: string, index: number) {
    const selectedCardEntry = selectedCards.find(
      (emoji) => emoji.index === index
    );
    if (!selectedCardEntry && selectedCards.length < 2) {
      setSelectedCards((prevSelectedCards) => [
        ...prevSelectedCards,
        { name, index },
      ]);
    } else if (!selectedCardEntry && selectedCards.length === 2) {
      setSelectedCards([{ name, index }]);
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center mt-6'>
      <h1 className='text-2xl font-bold my-4'>Memory Game</h1>
      <div className='mb-12 inline-flex mx-4 gap-4'>
        <Select
          value={category} // Ensure reset works
          onValueChange={(value) => {
            handleCategorySelect(value);
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select a Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories.map((category: string) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={cards ? String(cards) : ''} // Ensure reset works
          onValueChange={(value) => {
            handleCardCount(value);
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Number of Cards' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cards</SelectLabel>
              {[5, 10, 20, 30, 50].map((count: number) => (
                <SelectItem key={count} value={String(count)}>
                  {count}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <MemoryCard
        handleClick={turnCard}
        emojis={emojiData}
        selectedCards={selectedCards}
        matchedCards={matchedCards}
      />

      {isGameOver && width && height && (
        <Confetti run={isGameOver} width={width - 20} height={height - 10} />
      )}

      {isGameOver && (
        <div className='flex flex-col items-center'>
          <h1 className='text-6xl font-bold my-8 text-red-600'>You Win!</h1>
          <Button onClick={resetAll}>Play Again</Button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
