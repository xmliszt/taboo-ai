type NonEditableRowProps = {
  title: string;
  value: string;
};

export function NonEditableRow(props: NonEditableRowProps) {
  return (
    <div className={'flex flex-row items-center justify-between hover:bg-secondary'}>
      <div>{props.title}</div>
      <div>{props.value}</div>
    </div>
  );
}
