import { Card, CardContent } from '@/components/ui/card';

type CookieCardProps = {
  name: string;
  purpose: string;
  provider?: string;
  service?: string;
  country?: string;
  type?: string;
  expiresIn?: string;
};

export function CookieCard(props: CookieCardProps) {
  return (
    <Card className='my-4'>
      <CardContent className='p-4'>
        <div className='flex flex-col gap-2 [&>div]:gap-4 [&>div]:text-right'>
          <div className='flex flex-row items-center justify-between'>
            <div className='text-base font-bold'>Name</div>
            <div className='text-base text-primary'>{props.name}</div>
          </div>

          <div className='flex flex-row items-center justify-between'>
            <div className='text-base font-bold'>Purpose</div>
            <div className='text-base text-primary'>{props.purpose}</div>
          </div>

          {props.provider && (
            <div className='flex flex-row items-center justify-between'>
              <div className='text-base font-bold'>Provider</div>
              <div className='text-base text-primary'>{props.provider}</div>
            </div>
          )}

          {props.service && (
            <div className='flex flex-row items-center justify-between'>
              <div className='text-base font-bold'>Service</div>
              <div className='text-base text-primary'>{props.service}</div>
            </div>
          )}

          {props.country && (
            <div className='flex flex-row items-center justify-between'>
              <div className='text-base font-bold'>Country</div>
              <div className='text-base text-primary'>{props.country}</div>
            </div>
          )}

          {props.type && (
            <div className='flex flex-row items-center justify-between'>
              <div className='text-base font-bold'>Type</div>
              <div className='text-base text-primary'>{props.type}</div>
            </div>
          )}

          {props.expiresIn && (
            <div className='flex flex-row items-center justify-between'>
              <div className='text-base font-bold'>Expires in</div>
              <div className='text-base text-primary'>{props.expiresIn}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
