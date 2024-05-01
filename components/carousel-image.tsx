'use client';
import { image } from "@nextui-org/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowCircleLeft, FaArrowCircleRight, FaCross } from "react-icons/fa";

export default function CarouselImage({ images, selected, closeCarousel, classes }: {
    images: {
        url: string,
        img_key: string,
    }[] | undefined,
    selected: string | null,
    closeCarousel: () => void,
    classes: string
}) {
    const currentImage = images?.filter((image) => image.img_key === selected)[0] as any;
    const [current, setCurrent] = useState(currentImage)
    const next = () => {
        const index = images?.findIndex((image) => image.img_key === current.img_key) as number;
        console.log(index);
        if (index !== -1 && images) {
            if (index === images?.length - 1) {
                setCurrent(images[0])
                return
            }
            setCurrent(images[index + 1])
        }
    }

    const back = () => {
        const index = images?.findIndex((image) => image.img_key === current.img_key) as number;
        console.log(index)
        if (index !== -1 && images) {
            if (index === 0) {
                setCurrent(images[images.length - 1])
                return
            }
            setCurrent(images[index - 1])
        }
    }
    return (
        <div className={`absolute md:top-0 left-0 z-40 w-[100vw] md:h-[100vh] h-[540px] overflow-hidden${classes}`} >

            <div className="w-full h-full md:p-8 px-2 bg-black/30 md:fixed">
                <CrossCircledIcon className="text-white md:top-10 top-5 right-5 md:right-10 absolute z-40 cursor-pointer" onClick={() => closeCarousel()} />
                <FaArrowCircleLeft onClick={() => back()} className="left-10 text-white text-2xl cursor-pointer top-[50%] bottom-[50%] translate-y-[50%] absolute" />
                <FaArrowCircleRight onClick={() => next()} className="right-10 text-2xl text-white cursor-pointer top-[50%] bottom-[50%] translate-y-[50%] absolute" />
                <Image src={current.url} width={500} height={500} sizes="" alt="property image" className={`w-full h-full object-fit-cover`} />
            </div>


        </div>
    )
}
