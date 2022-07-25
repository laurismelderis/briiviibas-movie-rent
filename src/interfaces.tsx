import React, { ImgHTMLAttributes } from 'react'

export interface Movie {
    id: number,
    name: string,
    genre: string,
    rentalPrice: number,
    countInStock: number,
}

export interface RentedMovie extends Movie {
    // rentId: number,
    countRented: number,
}
