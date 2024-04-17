import React, { useState, useEffect } from 'react'
// import logo_white from '../../assets/images/logo-white.png';
// import Switcher from '../../components/switcher';
import { Link } from 'react-router-dom';

export default function Comingsoon() {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.add('light')

        const interval = setInterval(() => {
            let startDate = new Date('April 21, 2024 0:0:0');
            let currentDate = new Date();
            const diff = startDate.getTime() - currentDate.getTime();

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setTime({ hours, minutes, seconds, days });
        }, 1000);

        return () => {
            clearInterval(interval);
        };

    }, []);

    return (
        <>
            <section className="relative bg-[url('../../assets/images/bg/bg2.jpg')] bg-no-repeat bg-center">
                <div className="absolute inset-0 bg-slate-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
                <div className="container-fluid relative">
                    <div className="grid grid-cols-1">
                        <div className="flex flex-col min-h-screen justify-center md:px-10 py-10 px-4">
                            {/* <div className="text-center">
                                <img src={logo_white} className="mx-auto h-7" alt="" />
                            </div> */}
                            <div className="title-heading text-center my-auto">
                                <div className="md:my-0 my-10">
                                    <div className="wave-effect relative tracking-tighter mb-6 md:text-5xl text-3xl font-bold text-white">
                                           <span className="relative inline-block" >COMING SOON</span>
                                        
                                        {/* <span className="relative inline-block" >C</span>
                                        <span className="relative inline-block" >O</span>
                                        <span className="relative inline-block" >M</span>
                                        <span className="relative inline-block" >I</span>
                                        <span className="relative inline-block" >N</span>
                                        <span className="relative inline-block" >G</span>
                                        <span className="relative inline-block" >S</span>
                                        <span className="relative inline-block" >O</span>
                                        <span className="relative inline-block" >O</span>
                                        <span className="relative inline-block" >N</span> */}
                                    </div>
                                    <p className="text-white/70 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all Giglink with their fans and unique token collectors!</p>

                                    <div id="countdown">
                                        <ul className="count-down list-none inline-block text-white text-center mt-8">
                                            <li id="days" className="count-number inline-block m-2">{time.days}
                                                <p className="count-head">Days</p></li>
                                            <li id="hours" className="count-number inline-block m-2">{time.hours}
                                                <p className="count-head">Hours</p></li>
                                            <li id="mins" className="count-number inline-block m-2">{time.minutes}
                                                <p className="count-head">Mins</p></li>
                                            <li id="secs" className="count-number inline-block m-2">{time.seconds}
                                                <p className="count-head">secs</p></li>
                                            <li id="end" className="h1"></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <Switcher /> */}
        </>
    )
}
