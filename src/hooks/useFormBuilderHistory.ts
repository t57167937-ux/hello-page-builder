import { useState, useCallback } from "react";

export function useFormBuilderHistory<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((newStateOrUpdater: T | ((prev: T) => T)) => {
    setPresent(currentPresent => {
      const newState = typeof newStateOrUpdater === 'function'
        ? (newStateOrUpdater as (prev: T) => T)(currentPresent)
        : newStateOrUpdater;
      setPast(prev => [...prev, currentPresent]);
      setFuture([]);
      return newState;
    });
  }, []);

  const undo = useCallback(() => {
    setPast(prevPast => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      setPresent(curr => {
        setFuture(prevFuture => [curr, ...prevFuture]);
        return previous;
      });
      return prevPast.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture(prevFuture => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      setPresent(curr => {
        setPast(prevPast => [...prevPast, curr]);
        return next;
      });
      return prevFuture.slice(1);
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setPast([]);
    setPresent(newState);
    setFuture([]);
  }, []);

  return {
    state: present,
    set,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
