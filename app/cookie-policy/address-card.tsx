import { Card, CardContent } from '@/components/ui/card';

type AddressCardProps = {
  title: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
};

export function AddressCard(props: AddressCardProps) {
  return (
    <Card className='my-4 w-fit'>
      <CardContent className='w-fit p-4'>
        <div className='flex flex-col justify-start text-sm font-light text-secondary-foreground [&_div]:!leading-[1.2rem]'>
          <div>{props.title}</div>
          <div>{props.address}</div>
          <div>{props.city}</div>
          <div>
            {props.country} {props.postalCode}
          </div>
          <div>
            Phone: <div className='inline'>{props.phone}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
