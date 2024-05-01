'use client';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import SelectTownship from "./list-create-forms/select-township";
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import SelectType from "./list-create-forms/select-type";
import SelectLocation from "./list-create-forms/select-location";
import Amenties from "./list-create-forms/amenties";
import TitleDescription from "./list-create-forms/description";
import ImageUpload from "./list-create-forms/image-upload";
import PriceAvailability from "./list-create-forms/price-availability";
import { createListing } from "@/actions/listingActions";
import { DevTool } from "@hookform/devtools";
import Address from "./list-create-forms/address";

enum STEPS {
    CATGORY = 0,
    Type = 1,
    Address = 2,
    LOCATION = 3,
    AMENTIES = 4,
    DESCRIPTION = 5,
    IMAGES = 6,
    PRICE = 7,
}

export interface FormValues {
    township: string;
    type: string;
    lat: number;
    long: number;
    city: string;
    townshipRepeat: string;
    ward: string;
    street: string;
    num: string;
    bedroom: number;
    bath: number;
    parking: boolean;
    title: string;
    description: string;
    url: string[];
    price: number;
    availability: boolean;
    images: File[] | null;

}

export type Names = "township" | "type" | "lat" | "long" | "city" | "townshipRepeat" | "ward" | "street" | "num" | "bedroom" | "bath" | "parking" | "title" | "description" | "url" | "price" | "availability" | `url.${number}` | 'images'

export function AddListing({ session }: { session: Session | null }) {
    const [open, setOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [townshipSelect, setTownshipSelect] = useState('');
    const [typeSelect, setTypeSelect] = useState('');
    const [imageList, setImageList] = useState<File[] | []>([]);
    const [fileUrl, setFileUrl] = useState<{ url: string, img_key: string }[] | []>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const defaultValues = {
        township: '',
        type: '',
        lat: 16.8409,
        long: 96.1735,
        city: '',
        townshipRepeat: '',
        ward: '',
        street: '',
        num: '',
        bedroom: 0,
        bath: 0,
        parking: false,
        title: '',
        description: '',
        url: [],
        price: 0,
        availability: false,
        images: null,
    }
    const {
        register,
        trigger,
        handleSubmit,
        setValue,
        watch,
        formState,
        control,
        reset
    } = useForm<FormValues>({
        mode: 'all',
        defaultValues: defaultValues
    })

    const township = watch('township');
    const type = watch('type');
    const lat = watch('lat');
    const long = watch('long');
    const bedroom = watch('bedroom');
    const bath = watch('bath');
    const parking = watch('parking');
    const title = watch('title');
    const description = watch('description');
    const price = watch('price')
    const availability = watch('availability');
    const url = watch('url');
    const city = watch('city');
    const townshipRepeat = watch('townshipRepeat');
    const ward = watch('ward');
    const street = watch('street');
    const num = watch('num');
    const images = watch('images');




    const setCustomValue = (id: Names, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }


    useMemo(() => {
        setCustomValue('url', fileUrl);
    }, [fileUrl])


    function next() {
        if (currentStep === STEPS.CATGORY && townshipSelect === '') {
            toast.error('Please Choose One Category!')
            return
        }

        if (currentStep === STEPS.Type && typeSelect === '') {
            toast.error('Please Choose One Type Of Property!')
            return
        }

        if (currentStep === STEPS.LOCATION && +lat === 0 && +long === 0) {
            toast.error('Please Eenter Positive Values!')
            return
        }


        if (currentStep === STEPS.DESCRIPTION && (description === '' || title === '')) {
            toast.error('Please Write Title And Description!')
            return
        }

        if (currentStep === STEPS.IMAGES && fileUrl.length === 0) {
            toast.error('Please Upload At Least One Image!')
            return
        }

        if (currentStep === STEPS.PRICE && !(price > 0)) {
            toast.error('Please Set Valid Rental Fees!')
            return
        }




        setCurrentStep(i => {
            if (i >= STEPS.PRICE) return i
            return i + 1
        })
    }

    function back() {
        setCurrentStep(i => {
            if (i <= 0) return i
            return i - 1
        })
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (currentStep !== STEPS.PRICE) {
            next();
            return
        }
        const output = {
            ...data,
            price: +data.price,
            lat: +lat,
            long: +long
        }
        setIsLoading(true);
        try {
            const res = await createListing(output);
            if (res.error) {
                toast.error(res.error)
                return
            }

        } catch (error) {
            console.log(error);
            toast.error('Failed to create listing')
            return
        } finally {
            setFileUrl([]);
            setTownshipSelect('');
            setTypeSelect('');
            setCurrentStep(STEPS.CATGORY);
            reset(defaultValues);
            toast.success("Listing created");
            setIsLoading(false)
            router.push('/')
        }

    }

    function goto(index: number) {
        setCurrentStep(index)
    }


    const onAdd = () => {
        if (!session) {
            router.push('/signin');
            toast.error('You need to login first')
            return
        }

        setOpen(true)
    }




    const actionLable = useMemo(() => {
        if (currentStep === STEPS.PRICE) {
            return 'Create';
        }

        return 'Next';
    }, [currentStep])


    const secondaryActionLabel = useMemo(() => {
        if (currentStep === STEPS.CATGORY) {
            return undefined;
        }

        return 'Back'
    }, [currentStep])

    return (
        <Dialog open={open} onOpenChange={setOpen} modal  >

            <Button
                onClick={onAdd}
                variant="outline"
                className="rounded-xl py-2"
            >
                <FaPlus className="md:mr-2" />
                <span className="hidden md:inline-block">Add Listing</span>
            </Button>

            <DialogContent className="sm:max-w-[425px] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {currentStep === STEPS.CATGORY && <>Which township is it located in?</>}
                        {currentStep === STEPS.Type && <>What type is your property?</>}
                        {currentStep === STEPS.LOCATION && <>Where is it located?</>}
                        {currentStep === STEPS.AMENTIES && <>What amenties are included in yout property?</>}
                        {currentStep === STEPS.DESCRIPTION && <>Please enter title and description.</>}
                        {currentStep === STEPS.Address && <>Please enter Address Details.</>}
                        {currentStep === STEPS.IMAGES && <>Property Images</>}
                        {currentStep === STEPS.PRICE && <>Set price and availability</>}

                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <form action="" className="flex flex-col gap-8 h-full" onSubmit={handleSubmit(onSubmit)}>
                    {currentStep === STEPS.CATGORY && <SelectTownship setCustomValue={setCustomValue} register={register} townshipSelect={townshipSelect} setTownshipSelect={setTownshipSelect} />}
                    {currentStep === STEPS.Type && <SelectType setCustomValue={setCustomValue} register={register} typeSelect={typeSelect} setTypeSelect={setTypeSelect} />}
                    {currentStep === STEPS.LOCATION && <SelectLocation setCustomValues={setCustomValue} errors={formState.errors} register={register} location={{ lat: lat, long: long }} />}
                    {currentStep === STEPS.Address && <Address register={register} errors={formState.errors} />}
                    {currentStep === STEPS.AMENTIES && <Amenties setCustomValue={setCustomValue} register={register} amentiesList={{ bedroom, bath, parking }} />}
                    {currentStep === STEPS.DESCRIPTION && <TitleDescription errors={formState.errors} register={register} />}
                    {currentStep === STEPS.IMAGES && <ImageUpload register={register} imageList={imageList} setImageList={setImageList} fileUrl={fileUrl} setFileUrl={setFileUrl} />}
                    {currentStep === STEPS.PRICE && <PriceAvailability errors={formState.errors} availability={availability} setCustomValue={setCustomValue} register={register} />}

                    <DialogFooter className="flex flex-col mt-auto">
                        {secondaryActionLabel !== undefined &&
                            <Button type="button" className="w-full" onClick={back}>{secondaryActionLabel}</Button>
                        }
                        <Button type="submit" onClick={() => {
                            trigger()
                        }} className="w-full">{actionLable}</Button>
                    </DialogFooter>
                </form>
                {/* <DevTool control={control} /> */}
            </DialogContent>
        </Dialog>
    )
}
