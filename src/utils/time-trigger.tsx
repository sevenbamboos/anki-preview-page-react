import {useState, useCallback} from 'react';

const useTimeTrigger = () => {
  const [timeTrigger, setTimeTrigger] = useState(new Date().toString());

  const updateTimer = useCallback(() => {
    setTimeTrigger(new Date().toString());
  }, []);

  return [timeTrigger, updateTimer];
};

export default useTimeTrigger;