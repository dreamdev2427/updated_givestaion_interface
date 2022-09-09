import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div>
            <div className="flex items-center justify-center w-screen h-screen bg-gradient-primary">
                <div className="px-40 py-20 bg-white rounded-md shadow-xl">
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-rose-400 text-9xl">404</h1>

                        <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                            <span className="text-rose-500">Oops!</span> Page not found
                        </h6>

                        <p className="mb-8 text-center text-gray-500 md:text-lg">
                            The page you’re looking for doesn’t exist.
                        </p>

                        <Link to="/" className="px-6 py-2 text-sm font-semibold text-cyan-400 bg-cyan-100 rounded">Go home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
