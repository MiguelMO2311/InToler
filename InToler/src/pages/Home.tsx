import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Book {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    publishedDate?: string;
  };
}

function Home() {
  const [showTitle, setShowTitle] = useState(true);
  const colors = ['green', 'white', 'goldenrod'];
  const homeRef = useRef<HTMLDivElement>(null);
  const [books, setBooks] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTitle((show) => !show);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateBooks = (books: Book[]) => {
    const bookElements: JSX.Element[] = [];
    const offsetWidth = homeRef.current?.offsetWidth ?? 0;
    const offsetHeight = homeRef.current?.offsetHeight ?? 0;
    const headerHeight = 200;

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * (offsetWidth - 2);
      const y = Math.random() * (offsetHeight - headerHeight) + headerHeight;
      bookElements.push(
        <span
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            color: color,
            fontSize: 'bold',
            fontFamily: 'italic',
          }}
        >
          <a href={`https://www.google.com/books/edition/_/${book.id}`} target="_blank" rel="noopener noreferrer">
            <img
              src={book.volumeInfo?.imageLinks?.thumbnail || '../assets/No_Book.jpg'}
              alt={book.volumeInfo?.title || ''}
              style={{ width: '60%', height: '70%' }} // Hacer la imagen más pequeña
            />
          </a>
        </span>
      );
    }
    setBooks(bookElements);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://www.googleapis.com/books/v1/volumes?q=subject:"Restaurants"&maxResults=40'
        );
        const items = response.data.items || [];
        const filteredItems = items.filter((book: Book) => {
          const year = book.volumeInfo.publishedDate?.substring(0, 4);
          return year && parseInt(year) >= 2000;
        });
      
        generateBooks(filteredItems);
      } catch (error) {
        console.error('Error al obtener los libros:', error);
      }
      setIsLoading(false);
    };

    fetchBooks();
  }, []);

  return (
    <div
      ref={homeRef}
      className="bg-cover bg-center h-screen transition-all duration-1000"
      style={{
        backgroundImage:
          "url('/imgs/img_fondo_home.jpg')",
        backgroundSize: '40%',
        maxHeight: '640px',
      }}
    >
      {showTitle && (
        <h1
          className="absolute top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-8xl opacity-70 animate-fadeInOut size-max"
        >
          ¡Reservation In-Toler!
        </h1>
      )}
      {isLoading ? (
        <p>Cargando libros...</p>
      ) : (
        <>
          {books}
        </>
      )}
    </div>
  );
}

export default Home;
