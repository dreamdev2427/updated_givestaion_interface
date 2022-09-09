import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'

export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className='footer w-full'>
            <section className="relative overflow-hidden">
                <div className="container bg-tarnsparent">
                    <nav className="flex justify-between py-6">
                        <div className="flex justify-between items-center flex-wrap w-full">
                            <div className="md:w-6/12 w-full lg:mb-0 mb-3">
                                <NavLink className="flex items-center justify-center md:justify-start whitespace-nowrap" to="/">
                                    <img className="h-12" src="/images/logo.png" alt="logo" />
                                    <h4 className=' ml-1 font-medium text-xl title text-slate-800 dark:text-gray-100 tracking-widest'>GiveStation</h4>
                                </NavLink>
                            </div>
                            <div className="md:w-6/12 w-full lg:mb-0 mb-6">
                                <ul className="flex justify-center md:justify-end">
                                    <li className="mr-9"><NavLink className='text-gray-700  dark:text-gray-100 font-bold' to="/page-two">Github</NavLink></li>
                                    <li className="mr-9"><NavLink className='text-gray-700  dark:text-gray-100 font-bold' to="/page-three">Telegram</NavLink></li>
                                    <li className="mr-9"><NavLink className='text-gray-700  dark:text-gray-100 font-bold' to="/page-three">Twitter</NavLink></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div className="flex justify-center lg:-mt-5 -mt-0">
                        <ul className="flex justify-center">
                            <a className='bg-white iconsbtn flex justify-center items-center rounded-full mr-4' href="/page-two"><img src="/images/fb.png" alt="facebook" className='mx-auto' /></a>
                            <a className='bg-white iconsbtn flex justify-center items-center rounded-full mr-4' href="/page-two"><img src="/images/meta.png" alt="meta" className='mx-auto' /></a>
                            <a className='bg-white iconsbtn flex justify-center items-center rounded-full mr-4' href="/page-two"><img src="/images/git.png" alt="git" className='mx-auto' /></a>
                            <a className='bg-white iconsbtn flex justify-center items-center rounded-full mr-4' href="/page-two"><img src="/images/telegram.png" alt="telegram" className='mx-auto' /></a>
                            <a className='bg-white iconsbtn flex justify-center items-center rounded-full' href="/page-two"><img src="/images/instagram.png" alt="instagram" className='mx-auto' /></a>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
