'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { sendEmail } from '@/lib/services/emailService';

import { useAuth } from '../../auth-provider';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Spinner } from '../spinner';

const contactFormSchema = z.object({
  nickname: z
    .string()
    .nonempty('Name/Nickanme cannot be empty.')
    .max(50, 'Name/Nickname cannot be more than 50 characters.'),
  email: z.string().nonempty('Email address cannot be empty.').email('Invalid email address'),
  message: z.string().nonempty('Message cannot be empty.'),
});

const ContactMe = () => {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      nickname: '',
      email: '',
      message: '',
    },
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (user) {
      user.nickname && form.setValue('nickname', user.nickname);
      user.email && form.setValue('email', user.email);
    } else {
      form.reset();
    }
  }, [user]);

  const onValid = async (values: z.infer<typeof contactFormSchema>) => {
    try {
      setIsSendingEmail(true);
      await sendEmail(values.nickname, values.email, values.message);
      toast.info('Email is sent successfully!');
      form.reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <section>
      <Card className='shadow-lg'>
        <CardHeader className='text-3xl'>Contact Me</CardHeader>
        <CardContent>
          <div className='flex flex-col gap-8'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onValid)} className='flex flex-col gap-4'>
                <FormField
                  control={form.control}
                  name='nickname'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How do we address you?</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Your name / nickname...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='Your email address' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your message</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isSendingEmail}>
                  {isSendingEmail ? <Spinner /> : <span>Send</span>}
                </Button>
              </form>
            </Form>

            <div className='flex w-full flex-row flex-wrap justify-center gap-4'>
              <a
                className='rounded-md transition-all hover:scale-105 hover:opacity-70'
                href='https://www.producthunt.com/posts/taboo-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-taboo&#0045;ai'
                target='_blank'
              >
                <Image
                  src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=387037&theme=light'
                  alt='Taboo&#0032;AI - Ignite&#0032;English&#0032;learning&#0032;in&#0032;game&#0032;of&#0032;Taboo&#0044;&#0032;with&#0032;AI | Product Hunt'
                  width='240'
                  height='50'
                />
              </a>
              <a
                className='rounded-md transition-all hover:scale-105 hover:opacity-70'
                href='https://www.producthunt.com/posts/taboo-ai?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-taboo&#0045;ai'
                target='_blank'
              >
                <Image
                  src='https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=387037&theme=light&period=weekly&topic_id=204'
                  alt='Taboo&#0032;AI - Ignite&#0032;English&#0032;learning&#0032;in&#0032;game&#0032;of&#0032;Taboo&#0044;&#0032;with&#0032;AI | Product Hunt'
                  width='240'
                  height='50'
                />
              </a>
              <a
                className='rounded-md transition-all hover:scale-105 hover:opacity-70'
                href='https://theresanaiforthat.com/ai/taboo-ai/?ref=embed'
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  alt="TabooAI is featured on THERE'S AN AI FOR THAT"
                  width='240'
                  height='65'
                  src='https://media.theresanaiforthat.com/featured4.png'
                />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ContactMe;
