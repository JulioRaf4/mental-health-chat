'use client';

import {
  ChatBubbleIcon,
  HeartFilledIcon,
  PersonIcon,
  GitHubLogoIcon,
} from '@radix-ui/react-icons';

export function ProductShowcase() {
  return (
    <div className="hidden lg:flex flex-col h-full w-[35em] max-w-2xl bg-zinc-50 dark:bg-zinc-900 p-12 justify-center text-foreground border-r border-zinc-200 dark:border-zinc-800 rounded-r-2xl">
      <div className="space-y-8 max-w-xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Mental Health Chat</h1>
        </div>

        <h2 className="text-4xl font-bold leading-tight">
          Support for your mental health through intelligent conversations
        </h2>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A safe platform to express feelings, receive guidance, and develop
          strategies for psychological well-being.
        </p>

        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="bg-zinc-200 rounded-full p-2 dark:bg-zinc-800">
              <ChatBubbleIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
            </div>
            <div>
              <h3 className="font-medium">Therapeutic conversations</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Safe and confidential dialogues that help explore thoughts and
                emotions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-zinc-200 rounded-full p-2 dark:bg-zinc-800">
              <HeartFilledIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
            </div>
            <div>
              <h3 className="font-medium">Emotional support</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Personalized resources to manage stress, anxiety, and everyday
                challenges.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-zinc-200 rounded-full p-2 dark:bg-zinc-800">
              <PersonIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
            </div>
            <div>
              <h3 className="font-medium">Personal development</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Tools and insights for personal growth and building resilience.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-zinc-200 rounded-full p-2 dark:bg-zinc-800">
              <GitHubLogoIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
            </div>
            <div>
              <h3 className="font-medium">Open Source</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                The code is open source and Totally Free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
