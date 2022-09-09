import React, { useEffect } from 'react'
import UserFooter from '../components/user/UserFooter';
import Header from '../components/HeaderHome'

export default function FaqOne() {
    const Accordion = [
        { number:'02',  title: 'I don\'t need a brand strategist but I need help executing an upcoming campaign. Can we still work together?', desc: 'As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.'},
        {  number:'03',  title: 'Alright, but what exactly do you do?', desc: 'As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.'},
        {  number:'04',  title: 'Alright, but what exactly do you do?', desc: 'As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.'},
    ]
    useEffect(() => {

        const accordions = document.querySelectorAll(".accordion");

        const openAccordion = (accordion) => {
            const content = accordion.querySelector(".accordion__content");
            accordion.classList.add("accordion__active");
            content.style.maxHeight = content.scrollHeight + "px";
        };

        const closeAccordion = (accordion) => {
            const content = accordion.querySelector(".accordion__content");
            accordion.classList.remove("accordion__active");
            content.style.maxHeight = null;
        };

        accordions.forEach((accordion) => {
            const intro = accordion.querySelector(".accordion__intro");
            const content = accordion.querySelector(".accordion__content");

            intro.onclick = () => {
                if (content.style.maxHeight) {
                    closeAccordion(accordion);
                } else {
                    accordions.forEach((accordion) => closeAccordion(accordion));
                    openAccordion(accordion);
                }
            };
        });

    })
    return (
        <div>
            {/* header */}
            <Header />

            <section className="faqone py-24">
                <div className="container w-full lg:w-4/12 p-5">
                    <div className="accordion accordion__active">
                        <div className="flex flex-start">
                            <div className="number">01</div>
                            <div className="content">
                                <div className="accordion__intro">
                                    <h4>Alright, but what exactly do you do?</h4>
                                </div>
                                <div className="accordion__content" style={{maxHeight: '100%'}}>
                                    <p>As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {Accordion.map((i,index)=>(
                        <div className="accordion" key={index}>
                            <div className="flex flex-start">
                                <div className="number">{i.number}</div>
                                <div className="content">
                                    <div className="accordion__intro">
                                        <h4>{i.title}</h4>
                                    </div>
                                    <div className="accordion__content">
                                        <p>{i.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <UserFooter />
        </div>
    )
}
