import { useRouter } from 'next/router';

const TrashbinPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Now use id to fetch data for the trashbin
  console.log(id);

  return (
    <div>
      {/* Render your trashbin data */}
    </div>
  );
};

export default TrashbinPage;
