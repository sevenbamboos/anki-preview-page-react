import {useState, useEffect, ReactNode} from 'react';

function useTouchAndHide(duration: number, dependency: ReactNode) {

  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);

  }, [duration, dependency]);

  return [visible, setVisible];
}

export default useTouchAndHide;
