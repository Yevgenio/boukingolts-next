// components/game/useKeyboardControls.ts
'use client';
import { useState, useEffect } from 'react';

const useKeyboardControls = () => {
  const [keys, setKeys] = useState({
    up: false,
    down: false,
    rollLeft: false,
    rollRight: false,
    yawLeft: false,
    yawRight: false,
    shoot: false, // ← Add this
  });

  useEffect(() => {
    const mapKey = (key: string) => {
      switch (key.toLowerCase()) {
        case 'w': case 'arrowup': return 'up';
        case 's': case 'arrowdown': return 'down';
        case 'a': case 'arrowleft': return 'rollLeft';
        case 'd': case 'arrowright': return 'rollRight';
        case 'q': return 'yawLeft';
        case 'e': return 'yawRight';
        case ' ': return 'shoot'; // ← Add this
        default: return null;
      }
    };

    const down = (e: KeyboardEvent) => {
      const k = mapKey(e.key);
      if (k) setKeys(prev => ({ ...prev, [k]: true }));
    };
    const up = (e: KeyboardEvent) => {
      const k = mapKey(e.key);
      if (k) setKeys(prev => ({ ...prev, [k]: false }));
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return keys;
};

export default useKeyboardControls;
