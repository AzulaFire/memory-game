'use client';
import Form from '@/components/Form';
import MemoryCard from '@/components/MemoryCard';
import { FormEvent, useState, useEffect } from 'react';

//timestamp: 1:55:03

type Emoji = {
  htmlCode: string;
  name: string;
};

type Card = {
  name: string;
  index: number;
};

const HomePage = () => {
  const [isGameOn, setIsGameOn] = useState<boolean>(false);
  const [emojiData, setEmojiData] = useState<Emoji[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<Card[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  console.log(isGameOver, matchedCards.length, emojiData.length);

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

  // Async function for starting the game
  async function startGame(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault(); // Prevent form submission
      const response = await fetch(
        'https://emojihub.yurace.pro/api/all/category/animals-and-nature'
      );
      if (response.ok) {
        // Optionally, handle the data returned by the API
        const data = await response.json();

        const randomData: Emoji[] = [];

        for (let i = 0; i < 5; i++) {
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

        setIsGameOn(true); // Set the game as "on"
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
      {!isGameOn && <Form handleSubmit={startGame} />}
      {isGameOn && (
        <MemoryCard
          handleClick={turnCard}
          emojis={emojiData}
          selectedCards={selectedCards}
          matchedCards={matchedCards}
        />
      )}
    </main>
  );
};
export default HomePage;
