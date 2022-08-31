import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import Auth from '../utils/auth';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { removeBookId, saveBookIds } from '../utils/localStorage';
import { REMOVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || [];

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      const response = await removeBook({
        variables: { bookId: bookId },
      });

      if (!response) {
        throw new Error("something went horribly, terribly wrong");
      }
      removeBookId(bookId);
    } catch (error) {
      console.log(error);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const savedBookIds = userData.savedBooks.map((book) => book.bookId);
  saveBookIds(savedBookIds);

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;