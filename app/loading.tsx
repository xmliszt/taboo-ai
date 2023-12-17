import LoadingMask from '../components/custom/loading-mask';

export default function Loading() {
  return <LoadingMask isLoading={true} message={'Taboo AI is thinking >_< ...'} />;
}
