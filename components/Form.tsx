'use client';

import { Button } from '@/components/ui/button';

interface FormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({ handleSubmit }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the default button behavior to avoid form submission directly
    e.preventDefault();
    // Trigger form submission logic manually
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
  };

  return (
    <form className='wrapper' onSubmit={handleSubmit}>
      <Button onClick={handleClick}>Start Game</Button>
    </form>
  );
};

export default Form;
