import { useState, useEffect } from 'react';

// This custom hook is used to debounce value which only updates after 500ms
const useDebounce = (value, delay=500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default useDebounce;
