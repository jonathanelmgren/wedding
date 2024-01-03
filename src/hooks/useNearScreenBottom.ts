import { useCallback, useEffect, useState } from 'react';

export const useNearScreenBottom = (offset = 2500) => {
    const [isNearBottom, setIsNearBottom] = useState(false);

    const handleScroll = useCallback(() => {
        const isCloseToBottom =
            window.innerHeight + document.documentElement.scrollTop + offset >= document.documentElement.offsetHeight;
        setIsNearBottom(isCloseToBottom);
    }, [offset]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return isNearBottom;
};
