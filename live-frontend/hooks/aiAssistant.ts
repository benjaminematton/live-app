import { useState } from 'react';
import * as assistantAPI from '@/app/api/assistant';
import { ActivityResponse} from '@/app/types/types';
import { v4 as uuid } from 'uuid';

export type ChatMsg =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; activities: ActivityResponse[] };

export function useAssistant() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

  const sendInitial = async (meta: string) => {
    setMsgs(m => [...m, { id: uuid(), role: 'user', text: meta }]);
    setLoading(true);
    const schedule = await assistantAPI.initSchedule(meta);
    setMsgs(m => [...m, { id: uuid(), role: 'assistant', activities: schedule }]);
    setLoading(false);
  };

  const refine = async (diff: string) => {
    setMsgs(m => [...m, { id: uuid(), role: 'user', text: diff }]);
    setLoading(true);
    const schedule = await assistantAPI.refineSchedule(diff);
    setMsgs(m => [...m, { id: uuid(), role: 'assistant', activities: schedule }]);
    setLoading(false);
  };

  return { msgs, loading, sendInitial, refine };
}
