import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';

interface BookContextType {
    userRating: number | undefined;
    status: string | undefined;
    setUserRating: (rating: number | undefined) => void;
    setStatus: (status: string | undefined) => void;
}

interface BookProviderProps {
    children: ReactNode;
    initialStatus?: string;
    initialUserRating?: number;
}

export const useBookContext = () => {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error("useBookContext must be used within a BookProvider");
    }
    return context;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<BookProviderProps> = ({ children, initialStatus, initialUserRating }) => {
    const [status, setStatus] = useState<string | undefined>(initialStatus);
    const [userRating, setUserRating] = useState<number | undefined>(initialUserRating);

    useEffect(() => {
        setUserRating(initialUserRating);
        setStatus(initialStatus);
    }, [initialUserRating, initialStatus]);

    return (
        <BookContext.Provider value={{ userRating, status, setUserRating, setStatus }}>
            {children}
        </BookContext.Provider>
);
};
