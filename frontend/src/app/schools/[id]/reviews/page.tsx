import { ReviewList, type ReviewItem } from '@/components/ReviewList';

interface Props { params: { id: string } }

export default async function SchoolReviewsPage({ params }: Props) {
  // 後で API 連携
  const mock: ReviewItem[] = [
    { id: '1', rating: 5, comment: 'とても良い教室でした', userName: '保護者A', createdAt: new Date().toISOString() },
  ];
  return (
    <div>
      <h1>口コミ: {params.id}</h1>
      <ReviewList reviews={mock} />
    </div>
  );
}


