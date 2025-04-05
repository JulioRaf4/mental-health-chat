'use client';

import { useActionState as useReactActionState } from 'react';

export function useActionState(action: any, initialState: any) {
  return useReactActionState(action, initialState);
}
