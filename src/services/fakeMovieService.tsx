import _ from 'lodash'
import { Movie } from '../interfaces'

const movies: Array<Movie> = [
    {
        id: 0,
        name: 'Batman',
        genre: 'Action',
        rentalPrice: 5.49,
        countInStock: 5,
    },
    {
        id: 1,
        name: 'John wick',
        genre: 'Action',
        rentalPrice: 3.49,
        countInStock: 19,
    },
    {
        id: 2,
        name: 'Notebook',
        genre: 'Romantic',
        rentalPrice: 4.99,
        countInStock: 3,
    },
    {
        id: 3,
        name: 'Kung fu panda',
        genre: 'Adventure',
        rentalPrice: 3.99,
        countInStock: 0,
    },
    {
        id: 4,
        name: 'Fast and the furios',
        genre: 'Action',
        rentalPrice: 6.35,
        countInStock: 2,
    },
    {
        id: 5,
        name: 'Mission: Impossible',
        genre: 'Action',
        rentalPrice: 7.49,
        countInStock: 6,
    },

    {
        id: 6,
        name: 'Saw',
        genre: 'Horror',
        rentalPrice: 3.29,
        countInStock: 5,
    },
    {
        id: 7,
        name: 'Star Wars',
        genre: 'Adventure',
        rentalPrice: 5.29,
        countInStock: 10,
    },
    {
        id: 8,
        name: 'Revenant',
        genre: 'Survival',
        rentalPrice: 4.59,
        countInStock: 7,
    }
]

export const getMovies = () => {
    return movies
}

export const getMovie = (movie: Movie) => {
    return _.find(movies, { id: movie.id })
}
