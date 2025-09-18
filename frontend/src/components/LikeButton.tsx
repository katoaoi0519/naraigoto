'use client';

import { useState } from 'react';

export function LikeButton(props: { initialLiked?: boolean; onToggle?: (liked: boolean) => void }) {
  const [liked, setLiked] = useState(!!props.initialLiked);
  return (
    <button
      onClick={() => {
        const next = !liked;
        setLiked(next);
        props.onToggle?.(next);
      }}
      aria-pressed={liked}
    >
      {liked ? '♥ いいね済み' : '♡ いいね'}
    </button>
  );
}


