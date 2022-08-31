import { gql } from "@apollo/client";

export const GET_ME = gql`
{
    me {
        _id
        username
        email
        bookId
        savedBooks {
            title
            bookId
            authors
            description
            image
            link
        }
    }
}


`;