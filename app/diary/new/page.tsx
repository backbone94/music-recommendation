'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { writeDiary } from '@/app/actions/diary';

const NewDiaryEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await writeDiary(title, content);
      router.push('/diary');
    } catch (error) {
      console.error('Failed to save the diary entry:', error);
    }
  };

  return (
    <div>
      <h1>Write a New Diary Entry</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Save Diary Entry</button>
      </form>
    </div>
  );
};

export default NewDiaryEntry;
