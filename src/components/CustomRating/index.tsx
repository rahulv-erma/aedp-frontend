import { Button } from "@nextui-org/react";
import { useState } from "react";
import { IoMdStar } from "react-icons/io";

interface RatingComponentProps {
  totalStars?: number;
  onRating: (e: number) => void;
  filColor: string;
  bgColor: string;
}

const CustomRating: React.FC<RatingComponentProps> = ({
  totalStars = 5,
  onRating,
  filColor,
  bgColor,
}) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    if (onRating) onRating(rate);
  };

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Button
            key={index}
            isIconOnly
            radius="full"
            onClick={() => handleRating(starValue)}
            className="transition-all duration-200 bg-[transparent] min-w-0 w-[18px] h-[24px] p-0 m-0"
          >
            <IoMdStar
              size={24}
              style={{
                color: starValue <= rating ? filColor : bgColor,
                fill: starValue <= rating ? filColor : bgColor,
              }}
            />
          </Button>
        );
      })}
    </div>
  );
};

export default CustomRating;
