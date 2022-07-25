/// <reference path="../index.d.ts" />

import React, { useEffect, useState } from 'react'
import './App.css'
import { Movie, RentedMovie } from '../interfaces'
import { getMovies } from '../services/fakeMovieService'
import Table from './common/Table'
import checkImg from '../assets/check.png'
import deleteImg from '../assets/delete.png'
import _, { findIndex } from 'lodash'

function App () {
    const getRentedAllMovies = (): Array<RentedMovie> => {
        const storageMovies = localStorage.getItem('rentedMovies')
        const storageMoviesArray : RentedMovie[] | [] = JSON.parse(storageMovies || '[]')
        return storageMoviesArray
    }
    const loadIsInStock = () => {
        var movies: Array<Movie> = getMovies()
        if (localStorage.getItem('catalogMovies')) {
            var catalogMoviesStates : Array<Movie> | [] = JSON.parse(localStorage.getItem('catalogMovies') || '[]')
            if (catalogMoviesStates.length !== movies.length) {
                return false
            } else {
                return catalogMoviesStates
            }
        }
    }
    const [rentedMovies, setRentedMovies] = useState<Array<RentedMovie>>(getRentedAllMovies() || [])
    const [rentedMovieIdCounter, setRentedMovieIdCounter] = useState(0)
    const [catalogMovies, setCatalogMovies] = useState<Array<Movie>>(loadIsInStock() || getMovies())

    useEffect(() => {
        localStorage.setItem('rentedMovies', JSON.stringify(rentedMovies))
        localStorage.setItem('catalogMovies', JSON.stringify(catalogMovies))
    })
    const rentMovie = (movie: Movie) => {
        if (movie.countInStock > 0) {
            var count = 1
            var newRentedMovies: Array<RentedMovie> = [...rentedMovies]
            var rentedMovieCount: number = newRentedMovies.filter((movieObj) => movieObj.id === movie.id).length
            const newCatalogMovies: Array<Movie> = [...catalogMovies]
            // const newRentedMovie = {}
            if (rentedMovieCount > 0) {
                const movieIndex = newRentedMovies.findIndex(aMovie => aMovie.name === movie.name)
                newRentedMovies[movieIndex].countRented++
                const newRentedMovie: RentedMovie = newRentedMovies[movieIndex]
                const theMovie = newCatalogMovies.find((catalogMovie) => newRentedMovie.id === catalogMovie.id)!
                theMovie.countInStock--
                setCatalogMovies(newCatalogMovies)
            } else if (rentedMovieCount === 0) {
                const newRentedMovie: RentedMovie = {
                    countRented: 1,
                    ...movie,
                }
                newRentedMovies.push(newRentedMovie)
                const theMovie = newCatalogMovies.find((catalogMovie) => newRentedMovie.id === catalogMovie.id)!
                theMovie.countInStock--
                setCatalogMovies(newCatalogMovies)
            }
            // setRentedMovieIdCounter(rentedMovieIdCounter + 1)
            setRentedMovies(newRentedMovies)
        }
    }

    const removeRentedMovie = (rentedMovie: RentedMovie) => {
        const newRentedMovies: Array<RentedMovie> = [...rentedMovies]
        const rentedMovieCount = rentedMovie.countRented
        _.remove(newRentedMovies, { id: rentedMovie.id })
        setRentedMovies(newRentedMovies)

        const newCatalogMovies: Array<Movie> = [...catalogMovies]
        const theCatalogMovie = newCatalogMovies.find((movie) => movie.id === rentedMovie.id)
        if (theCatalogMovie) {
            theCatalogMovie.countInStock += rentedMovieCount
            setCatalogMovies(newCatalogMovies)
        }
    }
    const handleFocus = (event: any) => event.target.setSelectionRange(0, event.target.value.length)
    const prepareRentedMovies = () => {
        const newRentedMovies = []
        for (let i = 0; i < rentedMovies.length; i++) {
            const rentedMovie = rentedMovies[i]
            newRentedMovies.push({
                name: rentedMovie.name,
                genre: rentedMovie.genre,
                price: rentedMovie.rentalPrice,
                countRented: <div className='countCol'><button className='plusButton' onClick={() => plusOrMinus(rentedMovie, 'plus')}>+</button><input className="theCount" value={rentedMovie.countRented} onMouseUp = {handleFocus} onChange={event => countInputRented(event.target.value, rentedMovie)}/><button className='minusButton' onClick={() => plusOrMinus(rentedMovie, 'minus')}>-</button></div>,
                removeButton: <button className='removeButton' onClick={() => removeRentedMovie(rentedMovie)}>Remove</button>,
            })
        }
        return newRentedMovies
    }
    const countInputRented = (eventValue: string, rentedMovie: RentedMovie) => {
        console.log(eventValue)
        const newCatalogMovies: Array<Movie> = [...catalogMovies]
        const newRentedMovies: Array<RentedMovie> = [...rentedMovies]
        const catalogMovie: Movie = newCatalogMovies.find((movie) => rentedMovie.id === movie.id)!
        const eventValueInt: number = parseInt(eventValue)
        if (catalogMovie.countInStock >= (eventValueInt - rentedMovie.countRented)) {
            console.log('esee')
            const takeoutCount = eventValueInt - rentedMovie.countRented
            rentedMovie.countRented = eventValueInt
            catalogMovie.countInStock -= takeoutCount
            setCatalogMovies(newCatalogMovies)
            setRentedMovies(newRentedMovies)
        }
    }

    const plusOrMinus = (rentedMovie: RentedMovie, plusOrMinus: string) => {
        const newCatalogMovies: Array<Movie> = [...catalogMovies]
        const newRentedMovies: Array<RentedMovie> = [...rentedMovies]
        const catalogMovie: Movie = newCatalogMovies.find((movie) => movie.id === rentedMovie.id)!
        if (catalogMovie) {
            if (plusOrMinus === 'plus') {
                if (catalogMovie.countInStock !== 0) {
                    catalogMovie.countInStock--
                    setCatalogMovies(newCatalogMovies)
                    const indexOfRentedMovie = newRentedMovies.findIndex((movie) => movie.id === rentedMovie.id)
                    newRentedMovies[indexOfRentedMovie].countRented++
                }
            } else if (plusOrMinus === 'minus') {
                if (rentedMovie.countRented !== 0) {
                    catalogMovie.countInStock++
                    setCatalogMovies(newCatalogMovies)
                    const indexOfRentedMovie = newRentedMovies.findIndex((movie) => movie.id === rentedMovie.id)!
                    newRentedMovies[indexOfRentedMovie].countRented--
                    if (newRentedMovies[indexOfRentedMovie].countRented === 0) {
                        _.remove(newRentedMovies, { id: rentedMovie.id })
                    }
                    setRentedMovies(newRentedMovies)
                }
            }
        }
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
                            'Price',
                            'Count'
                        ]}
                        content={prepareRentedMovies()}
                    />
                </div>

            </div>
        </>
    )
}

export default App
