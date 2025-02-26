import { Card, CardContent } from './ui/card';
import { decodeEntity } from 'html-entities';

interface Emoji {
  htmlCode: string;
  name: string;
}

type Card = {
  name: string;
  index: number;
};

interface MemoryCardProps {
  emojis: Emoji[];
  handleClick: (name: string, index: number) => void;
  selectedCards: Card[];
  matchedCards: Card[];
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  emojis,
  handleClick,
  selectedCards,
  matchedCards,
}) => {
  const emojiEl = emojis.map((emoji, index) => {
    const selectedCardEntry = selectedCards.find(
      (emoji) => emoji.index === index
    );
    const matchedCardEntry = matchedCards.find(
      (emoji) => emoji.index === index
    );

    return (
      <li key={index} className='card-item'>
        <Card
          className='bg-primary cursor-pointer hover:bg-zinc-800 flex items-center justify-center aspect-square'
          onClick={() => handleClick(emoji.name, index)}
        >
          <CardContent className='flex items-center justify-center p-4'>
            <div className='text-6xl flex items-center justify-center w-full h-full'>
              {selectedCardEntry || matchedCardEntry
                ? decodeEntity(emoji.htmlCode[0])
                : '👻'}
            </div>
          </CardContent>
        </Card>
      </li>
    );
  });

  return <ul className='grid grid-cols-5 gap-6'>{emojiEl}</ul>;
};

export default MemoryCard;
