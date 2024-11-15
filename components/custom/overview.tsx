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
        tool designed to assist psychologists and patients in the field of mental health. Built with Next.js and Vercel's AI SDK, this chatbot template leverages the{' '}
        <code className="rounded-md bg-muted px-1 py-0.5">streamText</code>{' '}
        function on the server and the{' '}
        <code className="rounded-md bg-muted px-1 py-0.5">useChat</code> hook on the client to enable a seamless and supportive interaction experience for therapy and mental well-being applications.
      </p>
      </div>
    </motion.div>
  );
};
