import type { User } from '@supabase/supabase-js';
import { definitions } from 'types/supabase';
import supabase, { supabaseAdmin } from '~/supabase.server';
import { v4 as uuid } from 'uuid';

export type Note = definitions['notes'];

export async function getNote({
  id,
  userId
}: Pick<Note, 'id'> & {
  userId: User['id'];
}) {
  const { data, error } = await supabase
    .from<Note>('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id);
  if (error) throw error;
  return data[0];
}

export async function getNoteListItems({ userId }: { userId: User['id'] }) {
  const { data, error } = await supabase
    .from<Note>('notes')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function createNote({
  body,
  title,
  userId
}: Pick<Note, 'body' | 'title'> & {
  userId: User['id'];
}) {
  const newNoteId = uuid();
  const { data, error } = await supabaseAdmin.from<Note>('notes').insert(
    [
      {
        id: newNoteId,
        body,
        title,
        user_id: userId
      }
    ],
    {
      returning: 'minimal'
    }
  );
  if (error) throw error;
  return newNoteId;
}

export async function deleteNote({
  id,
  userId
}: Pick<Note, 'id'> & { userId: User['id'] }) {
  const { data, error } = await supabaseAdmin
    .from<Note>('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}
