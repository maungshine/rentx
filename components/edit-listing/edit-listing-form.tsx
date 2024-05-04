'use client'
import { Button } from '../ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useListingContext } from '@/hooks/useListingContext'
import { Card, CardFooter, CardHeader, Input, Spinner, Switch, Textarea } from '@nextui-org/react'
import { CardContent } from '../ui/card'
import dynamic from 'next/dynamic'
import SkeletonMap from '../list-create-forms/skeleton-map'
import CategoryInput from '../list-create-forms/category-input'
import { category } from '../category'
import { types } from '../list-create-forms/select-type'
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { saveListing } from '@/actions/listingActions'
import toast from 'react-hot-toast'
import { Label } from '../ui/label'
import { deleteImage, getSignedURL } from '@/actions/image-uploads'
import { AiOutlineLoading } from 'react-icons/ai'
import ImageFile from '../list-create-forms/image-file'
import Image from 'next/image'
import SkeletonCard from '../skeleton-card'

export type ListingType = {
    id: string,
    title: string,
    description: string,
    township: string,
    type: string,
    price: number,
    availability: boolean,
    lat: number,
    long: number,
    bath: number,
    bedroom: number,
    parking: boolean,
    url:
    {
        url: string,
        img_key: string
    }[],
    city: string,
    townshipRepeat: string,
    ward: string,
    street: string,
    num: string,

}

function EditListingForm() {

    const { listing, setListing } = useListingContext();
    const [reveal, setReveal] = useState(false);
    let imgToBeDelete: { url: string, img_key: string }[] = [];
    const [imgToBeSave, setImgToBeSave] = useState<{ url: string, img_key: string }[] | []>([]);

    const defaultValues: ListingType = {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        township: listing.township,
        type: listing.type,
        price: listing.price,
        availability: listing.availability,
        lat: listing.latitude,
        long: listing.longitude,
        bath: listing.amenties.bath,
        bedroom: listing.amenties.bedroom,
        parking: listing.amenties.parking,
        url: listing.images,
        city: listing.location.city,
        townshipRepeat: listing.location.township,
        ward: listing.location.ward,
        street: listing.location.street,
        num: listing.location.num,
    };



    const form = useForm({
        defaultValues: defaultValues,
        mode: 'onChange'
    });

    const { onBlur, ref, name } = form.register('url');
    useEffect(() => {

        form.setValue('id', listing.id)
        form.setValue('city', listing.location.city)
        form.setValue('townshipRepeat', listing.location.township)
        form.setValue('ward', listing.location.ward)
        form.setValue('street', listing.location.street)
        form.setValue('num', listing.location.num)
        form.setValue('title', listing.title)
        form.setValue('description', listing.description)
        form.setValue('lat', listing.latitude)
        form.setValue('long', listing.longitude)
        form.setValue('url', listing.images)
        form.setValue('price', listing.price)
        form.setValue('township', listing.township)
        form.setValue('type', listing.type)
        form.setValue('availability', listing.availability)
        form.setValue('bedroom', listing.amenties.bedroom)
        form.setValue('bath', listing.amenties.bath)
        form.setValue('parking', listing.amenties.parking)


    }, [listing])


    const url = form.watch('url');

    const onSubmit: SubmitHandler<ListingType> = async (data) => {
        if (imgToBeDelete.length > 0) {
            imgToBeDelete.forEach((img) => {
                handleDelete(img.img_key);
            })
        }

        if (imgToBeSave.length > 0) {
            setListing({ ...listing, images: [...listing.images, ...imgToBeSave] })
        }

        const output = {
            ...data,
            lat: +data.lat,
            long: +data.long,
            price: +data.price,
            url: [...listing.images, ...imgToBeSave]
        }
        const result = await saveListing(output);
        if (result.error) {
            toast.error('Failed to update listing.')
            return
        }

        toast.success('Listing updated.');
    }



    const handleDelete = async (img_key: string) => {
        const res = await deleteImage(img_key);
        if (res?.error) {
            toast.error(res.error)
            return
        }
        const newFileUrl = listing.images.filter((file) => img_key !== file.img_key)

        setListing({ ...listing, images: [...newFileUrl] })
        toast.success('Deleted successfully')
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;

        const imgList: File[] = [];
        const urls: string[] = [];
        if (file !== null) {
            Array.from(file).forEach(el => {
                imgList.push(el)
            })

            try {

                imgList.forEach(async (img) => {

                    //fetch signdedUrl from server
                    const signedUrl = await getSignedURL();
                    if (signedUrl.failure) {

                        throw new Error('Fail to upload!')
                    }
                    const url = signedUrl.success?.url as string;

                    const response = await fetch(url, {
                        method: 'PUT',
                        body: img,
                        headers: {
                            'Content-type': img.type,
                            'Access-Control-Allow-Origin': 'http://localhost:3000',
                        }
                    })

                    setImgToBeSave(prev => [...prev, { url: response.url.split('?')[0], img_key: signedUrl.success?.img_key as string }])
                    // console.log(response);
                    // setListing({ ...listing, images: [...listing.images, { url: response.url.split('?')[0], img_key: signedUrl.success?.img_key as string }] })

                })
            } catch (error) {
                console.log(error);
                toast.error("Failed to upload")
            } finally {

                e.target.files = null;
                toast.success('Upload Success!')
            }


        }
        return

    }

    const Map = useMemo(() => dynamic(() => import('../list-create-forms/map').then((module) => module.default), { suspense: true, loading: () => <SkeletonMap />, ssr: false }), [listing.latitude, listing.longitude]);

    return (
        <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8">
                <h1 className="text-2xl text-center font-semibold">Edit Listing</h1>

                <Card className="md:p-8">
                    <CardHeader>
                        Township
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:gird-cols-6 gap-4">
                        <input type="text" {...form.register('township')} className="hidden" />
                        {
                            category.map((item) => (
                                <CategoryInput
                                    onClick={() => {
                                        if (listing.township === item) {
                                            return
                                        } else {
                                            form.setValue('township', item, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                                shouldTouch: true,
                                            })
                                            setListing({ ...listing, township: item })
                                        }
                                    }}
                                    selected={listing.township === item}
                                    label={item}
                                    key={item}
                                />
                            ))
                        }

                    </CardContent>
                    <CardFooter>

                        {form.formState.errors.township &&
                            <div className="border-2 border-rose-400 bg-rose-200 text-rose-500 py-4 px-4 rounded-lg w-full">
                                {!form.formState.isValid && form.formState.errors.township.message}
                            </div>
                        }

                    </CardFooter>
                </Card>

                <Card className="md:p-8">
                    <CardHeader>
                        Type
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:gird-cols-6 gap-4">
                        <input type="text" {...form.register('type')} className="hidden" />

                        {
                            types.map((item) => (
                                <CategoryInput
                                    onClick={() => {
                                        if (listing.type === item) {
                                            return
                                        } else {
                                            form.setValue('type', item, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                                shouldTouch: true,
                                            })
                                            setListing({ ...listing, type: item })
                                        }
                                    }}
                                    selected={listing.type === item}
                                    label={item}
                                    key={item}
                                />
                            ))
                        }
                    </CardContent>
                </Card>

                <Card className="md:p-8 h-auto md:h-[400px]">
                    <CardContent className='flex gap-4 items-center md:h-full p-8 md:flex-row flex-col'>

                        <div className="flex w-[320px] shrink-0 h-[200px] items-center justify-center border-2 border-slate-500 border-dotted md:h-full">
                            <Label htmlFor="picture" className="border border-slate-400 bg-gray-100 py-2 px-2 cursor-pointer text-xs text-slate-600">Upload Images</Label>
                        </div>
                        <Input id="picture" multiple={true} type="file" onChange={(e) => handleUpload(e)} onBlur={onBlur} ref={ref} name={name} className="hidden" />
                        <div className="gap-4 px-4 overflow-x-scroll h-[320px] flex items-center justify-start">
                            {listing.images.length > 0 &&
                                <>
                                    {listing.images.map((url) =>
                                        <div key={url.img_key} className="w-[320px] shrink-0 relative">
                                            <FaTrashAlt onClick={(e) => {
                                                imgToBeDelete.push(url);
                                                const filteredArr = listing.images.filter((img) => img.img_key !== url.img_key);
                                                setListing({ ...listing, images: filteredArr })
                                            }} className="absolute top-2 right-2 text-slate-700 text-2xl cursor-pointer" />

                                            <Image alt='property image' className={`object-cover h-full w-full}`} src={url.url} width={500} height={500} />

                                        </div>
                                    )}
                                </>
                            }

                            {imgToBeSave.length > 0 &&
                                <>
                                    {imgToBeSave.map((url) =>
                                        <div key={url.img_key} className="w-[320px] shrink-0 relative">
                                            <FaTrashAlt onClick={(e) => {
                                                imgToBeDelete.push(url);
                                            }} className="absolute top-2 right-2 text-slate-700 text-2xl cursor-pointer" />

                                            <Image alt='property image' className={`object-cover w-full h-full}`} src={url.url} width={500} height={500} />

                                        </div>
                                    )}
                                </>
                            }
                        </div>

                    </CardContent>
                </Card>

                <Card className="md:p-8">
                    <CardHeader>
                        Location
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label='lat'
                            placeholder="Enter latitude position"
                            labelPlacement="inside"
                            variant="bordered"
                            {...form.register('lat', { required: 'Latitude is required' })}
                            onChange={(e) => {
                                setListing({ ...listing, latitude: +e.target.value })
                            }}

                            isInvalid={!!form.formState.errors.lat?.message}
                            errorMessage={form.formState.errors.lat?.message}

                        />

                        <Input
                            type="number"
                            label='longitude'
                            placeholder="Enter longitude position"
                            labelPlacement="inside"
                            variant="bordered"
                            {...form.register('long', { required: 'longitude is required' })}
                            onChange={(e) => {
                                setListing({ ...listing, longitude: +e.target.value })
                            }}

                            isInvalid={!!form.formState.errors.long?.message}
                            errorMessage={form.formState.errors.long?.message}
                        />

                        <div className="mt-4 w-ful h-[50vh] col-span-2">
                            <Map lat={listing.latitude} long={listing.longitude} />
                        </div>
                    </CardContent>
                </Card>



                <Card className="md:p-8">
                    <CardHeader>
                        Address
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Input
                            type="text"
                            label='City'
                            placeholder="Enter the city"
                            labelPlacement="inside"
                            variant="bordered"
                            // value={listing.location.city}
                            {...form.register('city', { required: 'City is required' })}
                            onChange={(e) => {
                                setListing({ ...listing, location: { ...listing.location, city: e.target.value } })
                            }}

                            isInvalid={!!form.formState.errors.city?.message}
                            errorMessage={form.formState.errors.city?.message}
                        />
                        <Input
                            type="text"
                            label='Township'
                            placeholder="Enter the township"
                            labelPlacement="inside"
                            variant="bordered"
                            // value={listing.location.township}
                            {...form.register('townshipRepeat', { required: 'Township is required.' })}
                            onChange={(e) => {
                                setListing({ ...listing, location: { ...listing.location, township: e.target.value } })
                            }}

                            isInvalid={!!form.formState.errors.townshipRepeat?.message}
                            errorMessage={form.formState.errors.townshipRepeat?.message}
                        />

                        <Input
                            type="text"
                            label='ward'
                            placeholder="Enter the ward"
                            labelPlacement="inside"
                            variant="bordered"
                            // value={listing.location.ward}
                            {...form.register('ward', { required: 'Ward is requred.' })}
                            onChange={(e) => {
                                setListing({ ...listing, location: { ...listing.location, ward: e.target.value } })
                            }}

                            isInvalid={!!form.formState.errors.ward?.message}
                            errorMessage={form.formState.errors.ward?.message}
                        />

                        <Input
                            type="text"
                            label='Street'
                            placeholder="Enter the ward"
                            labelPlacement="inside"
                            variant="bordered"
                            // value={listing.location.street}

                            {...form.register('street', { required: 'Street is required.' })}
                            onChange={(e) => {
                                setListing({ ...listing, location: { ...listing.location, street: e.target.value } })
                            }}

                            isInvalid={!!form.formState.errors.street?.message}
                            errorMessage={form.formState.errors.street?.message}
                        />
                        <Input
                            type="text"
                            label='Property Number'
                            labelPlacement="inside"
                            placeholder="Enter the number"
                            variant="bordered"
                            // value={listing.location.num}
                            {...form.register('num')}
                            onChange={(e) => {
                                setListing({ ...listing, location: { ...listing.location, num: e.target.value } })
                            }}

                            isInvalid={!!form.formState.errors.num?.message}
                            errorMessage={form.formState.errors.num?.message}
                        />
                    </CardContent>
                </Card>

                <Card className="md:p-8">
                    <CardHeader>
                        Amenties
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        <div className="flex justify-between items-center p-2 px-4 border-2 rounded-xl">
                            <p>Bedroom</p>
                            <input type="number" className="hidden" {...form.register('bedroom')} />
                            <div className="flex gap-2 items-center">
                                <span onClick={() => {
                                    setListing({ ...listing, amenties: { ...listing.amenties, bedroom: listing.amenties.bedroom + 1 } })

                                }} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaPlus /> </span>
                                <span>{listing.amenties.bedroom}</span>
                                <span onClick={() => {
                                    if (listing.amenties.bedroom === 0) {
                                        setListing({ ...listing, amenties: { ...listing.amenties, bedroom: 0 } })
                                        return
                                    }
                                    setListing({ ...listing, amenties: { ...listing.amenties, bedroom: listing.amenties.bedroom - 1 } })


                                }} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaMinus /> </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-2 px-4 border-2 rounded-xl">
                            <p>Bathroom</p>
                            <input type="number" className="hidden" {...form.register('bath')} />
                            <div className="flex gap-2 items-center">
                                <span onClick={() => {

                                    setListing({ ...listing, amenties: { ...listing.amenties, bath: listing.amenties.bath + 1 } })

                                }} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaPlus /> </span>
                                <span>{listing.amenties.bath}</span>
                                <span onClick={() => {
                                    if (listing.amenties.bath === 0) {
                                        setListing({ ...listing, amenties: { ...listing.amenties, bath: 0 } })
                                        return
                                    }
                                    setListing({ ...listing, amenties: { ...listing.amenties, bath: listing.amenties.bath - 1 } })


                                }} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaMinus /> </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-2 px-4 border-2 rounded-xl">
                            <p>Parking Availability</p>
                            <input type="radio" className="hidden" {...form.register('parking')} />
                            <div className="flex gap-2 items-center">
                                <Switch isSelected={listing.amenties.parking} onValueChange={() => {

                                    setListing({ ...listing, amenties: { ...listing.amenties, parking: !listing.amenties.parking } })

                                }} />
                            </div>
                        </div>

                    </CardContent>
                </Card >


                <Card className="md:p-8">
                    <CardHeader>
                        Title and description
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Input
                            type="text"
                            label='Title'
                            placeholder="Enter the title"
                            labelPlacement="inside"
                            variant="bordered"
                            // value={listing.title}
                            {...form.register('title')}
                            onChange={(e) => {
                                setListing({ ...listing, title: e.target.value })
                            }}

                            isInvalid={!!form.formState.errors.title?.message}
                            errorMessage={form.formState.errors.title?.message}
                        />
                        <Textarea
                            type="text"
                            label='Description'
                            placeholder="Enter the description"
                            labelPlacement="inside"
                            value={listing.description}

                            variant="bordered"
                            {...form.register('description')}
                            onChange={(e) => {
                                setListing({ ...listing, description: e.target.value })
                            }}

                            isInvalid={!!form.formState.errors.description?.message}
                            errorMessage={form.formState.errors.description?.message}
                        />

                    </CardContent>
                </Card>


                <Card className="md:p-8">
                    <CardHeader>
                        Amenties
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        <Input
                            type="number"
                            label='Rental Fees'
                            placeholder="Enter the fees"
                            labelPlacement="inside"
                            variant="bordered"
                            value={listing.price.toString()}
                            {...form.register('price')}
                            onChange={(e) => {
                                setListing({ ...listing, price: +e.target.value })
                            }}

                            isInvalid={!!form.formState.errors.price?.message}
                            errorMessage={form.formState.errors.price?.message}
                        />

                        <div className="flex justify-between items-center p-2 px-4 border-2 rounded-xl">
                            <p>Availability</p>
                            <input type="radio" className="hidden"  {...form.register('availability')} />
                            <div className="flex gap-2 items-center">
                                <Switch isSelected={listing.availability} onValueChange={() => {

                                    setListing({ ...listing, availability: !listing.availability })

                                }} />
                            </div>
                        </div>

                    </CardContent>
                </Card >

                <div className="flex">
                    <Button type="submit" className="ml-auto px-16" >Save</Button>
                </div>

            </div>

        </form>
    )
}

export default EditListingForm