"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
const heroImages = [
    {imgURL: '/assets/images/hero-1.svg', alt: 'smartwatch'},
    {imgURL: '/assets/images/hero-2.svg', alt: 'bag'},
    {imgURL: '/assets/images/hero-3.svg', alt: 'lamp'},
    {imgURL: '/assets/images/hero-4.svg', alt: 'airfryer'},
    {imgURL: '/assets/images/hero-5.svg', alt: 'chair'},
]

const HeroCarousel = () => {
    return (
    <div className="hero-carousel">
        <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
        >
            {heroImages.map((image) => (
                <Image
                    src={image.imgURL}
                    alt={image.alt}
                    width={484}
                    height={484}
                    key={image.alt}
                    className='object-contain'
                />
            ))}
        </Carousel>

        <Image src="assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="max-xl:hidden absolute -left-[15%] bottom-0"
        />
    </div>
    );
}

export default HeroCarousel