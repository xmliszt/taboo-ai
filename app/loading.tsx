import LoadingMask from './(components)/Loading';

export default function Loading() {
  return (
    <LoadingMask isLoading={true} message={'Taboo AI is thinking >_< ...'} />
  );
}
