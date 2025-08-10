import React from 'react'
import Button from '@mui/material/Button';
import { BiMenuAltRight } from "react-icons/bi";
import { MdCelebration } from "react-icons/md";
import { Link } from 'react-router-dom';


export default function MainNavbar() {
    return (
        <nav className='py-1'>
            <div className='container  flex items-center justify-end gap-8'>
                <div className='col1  items-center w-[30%]'>
                    <Link to="/categories"><Button className='!text-black  w-full gap-2'> <span className=' Link flex'><BiMenuAltRight className='text-[25px] font-serif    ' />SHOP BY CATEGORIES </span></Button></Link>

                </div>
                <div className='col2 w-[45%]'>
                    <ul>
                        <li className='font-serif text-purple-800 Link2 ml-4'>"I bring your favorite shops right to your screen — just one click away"</li>
                    </ul>
                </div>
                <div className='col3 w-[25%] gap-3 flex items-center  justify-around '>
                    <ul className='font-serif !hover:text-purple-600 gap-2   '>
                        <Button className='!text-black w-full  '> <span className='Link flex gap-3'> Check Surprise<  MdCelebration className='text-2xl ' /></span></Button>
                    </ul>
                </div>

            </div>
        </nav>
    )
}



