/// <reference path="../index.d.ts" />

import React, { useState } from 'react'
import './App.css'
import { Movie, RentedMovie } from '../interfaces'
import { getMovies } from '../services/fakeMovieService'
import Table from './common/Table'
import checkImg from '../assets/check.png'
import deleteImg from '../assets/delete.png'
import _ from 'lodash'

function App () {
    const [rentedMovies, setRentedMovies] = useState<Array<RentedMovie>>([])
    const [rentedMovieIdCounter, setRentedMovieIdCounter] = useState(0)
    const [catalogMovies, setCatalogMovies] = useState<Array<Movie>>(getMovies() || [])

    const rentMovie = (movie: Movie) => {
        if (movie.countInStock > 0) {
            const newRentedMovies: Array<RentedMovie> = [...rentedMovies]
            const newRentedMovie: RentedMovie = {
                rentId: rentedMovieIdCounter,
                ...movie,
            }
            setRentedMovieIdCounter(rentedMovieIdCounter + 1)

            newRentedMovies.push(newRentedMovie)
            setRentedMovies(newRentedMovies)

            const newCatalogMovies: Array<Movie> = [...catalogMovies]
            if (newCatalogMovies) {
                const theMovie = newCatalogMovies.find((catalogMovie) => newRentedMovie.id === catalogMovie.id)!
                theMovie.countInStock--
                setCatalogMovies(newCatalogMovies)
            }
        }
    }

    const removeRentedMovie = (rentedMovie: RentedMovie) => {
        const newRentedMovies: Array<RentedMovie> = [...rentedMovies]
        _.remove(newRentedMovies, { rentId: rentedMovie.rentId })
        setRentedMovies(newRentedMovies)

        const newCatalogMovies: Array<Movie> = [...catalogMovies]
        const theCatalogMovie = newCatalogMovies.find((movie) => movie.id === rentedMovie.id)
        if (theCatalogMovie) {
            theCatalogMovie.countInStock++
            setCatalogMovies(newCatalogMovies)
        }
    }

    const prepareRentedMovies = () => {
        const newRentedMovies = []
        for (let i = 0; i < rentedMovies.length; i++) {
            const rentedMovie = rentedMovies[i]
            newRentedMovies.push({
                name: rentedMovie.name,
                genre: rentedMovie.genre,
                price: rentedMovie.rentalPrice,
                removeButton: <button className='removeButton' onClick={() => removeRentedMovie(rentedMovie)}>Remove</button>,
            })
        }
        return newRentedMovies
    }

    const prepareCatalogMovies = () => {
        const preparedCatalogMovies = catalogMovies.map(catalogMovie => {
            return {
                name: catalogMovie.name,
                genre: catalogMovie.genre,
                price: catalogMovie.rentalPrice,
                count: catalogMovie.countInStock,
                isInStock: <img src={catalogMovie.countInStock > 0 ? checkImg : deleteImg} alt={''} />,
                rentButton: <button className="rentButton" onClick={() => rentMovie(catalogMovie)}>Rent</button>,
            }
        })
        return preparedCatalogMovies
    }

    return (
        <>
            <div className="banner-base">
                <div className="black-banner">
                    <div className="black-banner_title">Movie Rental</div>
                </div>
                <div className="white-banner"></div>
            </div>
            <div className="base">
                <div className="main">
                    <Table
                        headers={[
                            'Movie',
                            'Genre',
                            'Price',
                            'Is in stock'
                        ]}
                        content={prepareCatalogMovies()}
                    />
                </div>
                <div className="sideGrid">
                    <div>Rented movies</div>
                    <Table
                        headers={[
                            'Movie',
                            'Genre',
                            'Price'
                        ]}
                        content={prepareRentedMovies()}
                    />
                </div>

            </div>
        </>
    )
}

export default App
