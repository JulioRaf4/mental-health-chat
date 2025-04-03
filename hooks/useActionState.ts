'use client';

import { useFormState } from 'react-dom';

export function useActionState(action: any, initialState: any) {
  return useFormState(action, initialState);
}
