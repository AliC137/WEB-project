import React, { useEffect, useState } from 'react';

const Timer = ({ timeLimit, onTimeUp }) => {
  const [time, setTime] = useState(timeLimit);

  useEffect(() => {
    setTime(timeLimit); 


    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeUp(); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, onTimeUp]);

  return <div>{time} seconds remaining</div>;
};

export default Timer;
