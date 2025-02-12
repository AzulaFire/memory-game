'use client';
import Form from '@/components/Form';
import MemoryCard from '@/components/MemoryCard';
import { FormEvent, useState } from 'react';

function HomePage() {
  const [isGameOn, setIsGameOn] = useState<boolean>(false);
  const [emojiData, setEmojiData] = useState<string[]>([]);

  console.log(emojiData);

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
        setEmojiData(data.slice(0, 5));

        setIsGameOn(true); // Set the game as "on"
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error during fetch operation:', error);
    }
  }

  function turnCard(): void {
    console.log('Memory Card Clicked');
  }

  return (
    <main className='flex min-h-screen flex-col items-center mt-6'>
      <h1 className='text-2xl font-bold my-4'>Memory Game</h1>
      {!isGameOn && <Form handleSubmit={startGame} />}
      {isGameOn && <MemoryCard handleClick={turnCard} />}
    </main>
  );
}
export default HomePage;
