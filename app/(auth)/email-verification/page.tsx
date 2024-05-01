'use client';
import { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { emailVerification } from '@/actions/authActions';
import Link from 'next/link';

function VerifyYourEmail() {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const onSubmit = useCallback(() => {

        if (!token) {
            setError('Missing Token')
            return
        }
        emailVerification(token)
            .then((data) => {
                setSuccess(data.success)
                setError(data.error)
            })
            .catch(() => {
                setError('Something Went Wrong')
            })
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);
    return (
        <div className="w-[400px] mx-auto h-[100vh] flex flex-col" >
            <div className="my-auto flex flex-col gap-8">
                <div>
                    {!success && !error && <p className='text-center'>Verifying your email<BeatLoader className='inline-block mr-2' /></p>}
                </div>

                {error && (
                    <div className="bg-red-200 text-red-600 border border-2 border-red-300 py-3 px-2 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-200 text-green-600 border border-2 border-green-300 py-3 px-2 rounded-lg">
                        {success}
                    </div>
                )}
                <div className='flex flex-col items-center'>
                    <Link href='/login' className='px-4 py-2 bg-primary text-white'>Go To Login Page</Link>
                </div>


            </div>
        </div >
    )
}

export default VerifyYourEmail