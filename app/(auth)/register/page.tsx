'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/custom/auth-form';
import { ProductShowcase } from '@/components/custom/product-showcase';
import { SubmitButton } from '@/components/custom/submit-button';

import { register, RegisterActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    }
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast.error('Account already exists');
    } else if (state.status === 'failed') {
      toast.error('Failed to create account');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      toast.success('Account created successfully');
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen">
      <ProductShowcase />
      
      <div className="flex-1 flex items-start pt-12 md:pt-0 md:items-center justify-center relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/bg-mental.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)'
          }}
        />
        <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-8 z-10 shadow-lg">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-50">Sign Up</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Create an account with your email and password
            </p>
          </div>
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>Sign Up</SubmitButton>
            <p className="text-center text-sm text-zinc-600 mt-4 dark:text-zinc-400">
              {'Already have an account? '}
              <Link
                href="/login"
                className="font-semibold text-zinc-800 hover:underline dark:text-zinc-200"
              >
                Sign in
              </Link>
              {' instead.'}
            </p>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
