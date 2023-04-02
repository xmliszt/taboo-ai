import LoadingMask from './(components)/LoadingMask';

export default function Loading() {
  return (
    <LoadingMask isLoading={true} message={'Taboo AI is thinking >_< ...'} />
  );
}
