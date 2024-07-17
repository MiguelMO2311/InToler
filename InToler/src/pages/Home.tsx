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

interface BookPosition {
  x: number;
  y: number;
}

function Home() {
  const [showTitle, setShowTitle] = useState(true);
  const colors = ['green', 'white', 'goldenrod'];
  const homeRef = useRef<HTMLDivElement>(null);
  const [books, setBooks] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bookWidth = 60; // Define el ancho del libro
  const bookHeight = 70; // Define la altura del libro

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTitle((show) => !show);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const minMargin = 20; // Define el margen mínimo entre los libros

  const checkOverlap = (newBook: BookPosition, existingBooks: BookPosition[]) => {
    for (let i = 0; i < existingBooks.length; i++) {
      const existingBook = existingBooks[i];
      if (Math.abs(newBook.x - existingBook.x) < bookWidth + minMargin && Math.abs(newBook.y - existingBook.y) < bookHeight + minMargin) {
        return true;
      }
    }
    return false;
  };
  
  const generateBooks = (books: Book[]) => {
    const bookElements: JSX.Element[] = [];
    const offsetWidth = homeRef.current?.offsetWidth ?? 0;
    const offsetHeight = homeRef.current?.offsetHeight ?? 0;
    const headerHeight = 200;
    const placedBooks: BookPosition[] = [];

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const color = colors[Math.floor(Math.random() * colors.length)];
      let x, y;
      let attempts = 0;
      do {
        x = Math.random() * (offsetWidth - 2 - 300) + 150;
        y = Math.random() * (offsetHeight - headerHeight - 200) + headerHeight + 100;
        attempts++;
      } while (checkOverlap({x, y}, placedBooks) && attempts < 50);

      if (attempts >= 50) {
        console.log('No se pudo encontrar una posición no superpuesta para el libro:', book);
        continue;
      }

      placedBooks.push({x, y});

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
          'https://www.googleapis.com/books/v1/volumes?q=subject:"Food"&maxResults=40'
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
        backgroundSize: '100%',
        maxHeight: '670px',
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
