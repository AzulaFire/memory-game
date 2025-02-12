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
          className='bg-primary cursor-pointer hover:bg-zinc-800'
          onClick={() => handleClick(emoji.name, index)}
        >
          <CardContent>
            <div className='text-4xl flex items-center justify-center w-full h-full mt-7'>
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
