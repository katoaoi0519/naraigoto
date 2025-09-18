interface Props {
  params: { id: string };
}

export default function ClassDetailPage({ params }: Props) {
  return (
    <div>
      <h1>クラス詳細: {params.id}</h1>
    </div>
  );
}


