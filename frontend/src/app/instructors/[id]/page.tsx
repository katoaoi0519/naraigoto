interface Props {
  params: { id: string };
}


export default function InstructorDetailPage({ params }: Props) {
  return (
    <div>
      <h1>先生詳細: {params.id}</h1>
    </div>
  );
}


