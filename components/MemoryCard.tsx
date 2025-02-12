import { Card, CardContent } from './ui/card';

interface MemoryCardProps {
  handleClick: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ handleClick }) => {
  const emojiArray: string[] = [
    '🐶',
    '🐷',
    '🐙',
    '🐛',
    '🐵',
    '🐶',
    '🐷',
    '🐙',
    '🐛',
    '🐵',
  ];

  const emojiEl = emojiArray.map((emoji, index) => (
    <li key={index} className='card-item'>
      <Card
        className='bg-primary cursor-pointer hover:bg-zinc-800'
        onClick={handleClick}
      >
        <CardContent>
          <div className='text-4xl flex items-center justify-center w-full h-full mt-7'>
            {emoji}
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  return <ul className='grid grid-cols-5 gap-6'>{emojiEl}</ul>;
};

export default MemoryCard;
