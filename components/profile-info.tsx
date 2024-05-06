'use client';
import { Card, CardBody, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@nextui-org/react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Session } from 'next-auth'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import { saveInfo } from '@/actions/profileActions';
import { useRouter } from 'next/navigation';
import { CurrentUser } from '@/lib/form-schema';
import { getSession, useSession } from 'next-auth/react';
import { getCurrentUser } from '@/lib/helper';
import toast from 'react-hot-toast';

const messageColors = {
    error: 'red',
    success: 'green',
    warning: 'yellow',
}

function ProfileInfo({ currentUser, session }: { currentUser: CurrentUser | null, session: Session | null }) {
    const [mode, setMode] = useState<'normal' | 'edit'>('normal');
    const [noti, setNoti] = useState<{ message: string, category: string }>({ message: '', category: '' })
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    // const { data: session, update } = useSession()
    console.log('session : ', session)
    // useEffect(() => {
    //     router.refresh();
    // }, [update])


    return (
        <Card className='w-full'>
            <CardHeader className='text-center font-semibold text-neutral-800 justify-between flex'>
                <h2>Profile Information</h2>
                <Dropdown >
                    <DropdownTrigger className='cursor-pointer' disabled={mode === 'edit'}>
                        <DotsHorizontalIcon />
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem>
                            <Button variant='link' onClick={(e) => setMode('edit')} >Edit</Button>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

            </CardHeader>
            <CardBody className='flex flex-col gap-4'>
                {mode === 'normal'
                    ?
                    <>
                        {noti.message &&
                            //@ts-ignore
                            <div className={`p-4 text-sm border-2 border-${messageColors[noti.category]}-600 rounded-xl bg-${messageColors[noti.category]}-400`}>
                                <p>{noti.message}</p>
                            </div>
                        }
                        <p>{session?.user?.email}</p>
                        <div className='grid grid-cols-3 gap-4 bg-neutral-200 px-4 py-2 rounded-lg'>
                            <p className='border-r-2 col-span-1'>Name</p>
                            <p className='col-span-2'>{currentUser?.username}</p>
                        </div>
                        <div className='grid grid-cols-3 gap-4 bg-neutral-200 px-4 py-2 rounded-lg'>
                            <p className='border-r-2 col-span-1'>Email</p>
                            <p className='col-span-2'>{currentUser?.email}</p>
                        </div>
                    </>
                    :
                    <>
                        <p>{session?.user?.email}</p>
                        <Input
                            name='name'
                            type='text'
                            label='Name'
                            labelPlacement='outside-left'
                            defaultValue={currentUser?.username}
                            variant='bordered'
                            ref={nameRef}


                        />
                        <Input
                            name='email'
                            type='text'
                            label='Email'
                            labelPlacement='outside-left'
                            defaultValue={currentUser?.email}
                            variant='bordered'
                            ref={emailRef}
                            disabled={session?.user.provider === 'google'}

                        />
                        {session?.user.provider === 'google' &&
                            <p className='py-4 rounded-xl border-red-400 border-2 bg-red-300'>You are logged in with third party provider and the email can't be changed</p>
                        }
                        {noti.message &&
                            //@ts-ignore
                            <div className={`p-4 text-sm border-2 border-${messageColors[noti.category]}-600 rounded-xl bg-${messageColors[noti.category]}-200`}>
                                <p>{noti.message}</p>
                            </div>
                        }
                        <div className=''>
                            <Button onClick={async (e) => {
                                const name = nameRef.current?.value;
                                const email = emailRef.current?.value;

                                const res = await saveInfo(name as string, email as string);

                                // @ts-ignore
                                setNoti({ message: res[Object.keys(res)[0]], category: Object.keys(res)[0] });


                                //@ts-ignore
                                if (res.success || res.warning) {
                                    toast.success('reached here')

                                    // update({
                                    //     email: email,
                                    //     name: name,
                                    //     expires: new Date(new Date().getTime() + 600 * 1000)
                                    // })



                                    setMode('normal');

                                }

                                getSession();
                                router.refresh();

                            }} variant='default'> Save</Button>
                        </div>

                    </>
                }

            </CardBody>
            <CardFooter>

            </CardFooter>

        </Card >
    )
}

export default ProfileInfo