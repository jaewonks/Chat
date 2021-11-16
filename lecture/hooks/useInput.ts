import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from 'react';

const useInput = (initialValue: any) => {
  const [ value, setValue ] = useState(initialValue);
  const handler = useCallback((e) => {
    setValue((e.target.value));
  },[])
  return [value, handler, setValue];
};

export default useInput;

