export interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  userName?: string;
  createdAt: string;
}

export function ReviewList(props: { reviews: ReviewItem[] }) {
  if (!props.reviews?.length) return <p>口コミはまだありません。</p>;
  return (
    <ul>
      {props.reviews.map((r) => (
        <li key={r.id} style={{ marginBottom: 8 }}>
          <strong>★{r.rating}</strong> {r.comment}
          <div style={{ fontSize: 12, color: '#666' }}>
            {r.userName ? `${r.userName} / ` : ''}
            {new Date(r.createdAt).toLocaleDateString('ja-JP')}
          </div>
        </li>
      ))}
    </ul>
  );
}


