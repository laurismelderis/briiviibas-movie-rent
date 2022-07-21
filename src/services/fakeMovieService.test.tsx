import { getMovies } from './fakeMovieService'

import { Movie } from '../interfaces'

describe('Fake movie service', () => {
    it('should return movies', () => {
        const movies: Array<Movie> = getMovies()
        expect(movies.length).toBeGreaterThan(0)
    })
})
