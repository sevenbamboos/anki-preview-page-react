import {useState, useCallback} from 'react';

const useTimeTrigger = (): [string, () => void] => {
  const [timeTrigger, setTimeTrigger] = useState(new Date().toString());

  const updateTimer = useCallback(() => {
    setTimeTrigger(new Date().toString());
  }, []);

  return [timeTrigger, updateTimer];
};

export default useTimeTrigger;