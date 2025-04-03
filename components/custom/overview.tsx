import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, BrainIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <BrainIcon size={32} />
          <MessageIcon size={32} />
        </p>
        <p>
        This is an{' '}
        <Link
          className="font-medium underline underline-offset-4"
          href="https://github.com/JulioRaf4/rag-psychology-ui"
          target="_blank"
        >
          open source
        </Link>{' '}
        and free tool designed to assist psychologists and patients in the field of mental health. Built with Next.js and Vercel&apos;s AI SDK.{' '}
        and has been trained with psychology-focused content to provide tailored support for therapy and mental well-being applications.
      </p>
      </div>
    </motion.div>
  );
};
