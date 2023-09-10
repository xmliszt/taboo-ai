'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { sendEmail } from '@/lib/services/emailService';
import ProductHuntBadge from '@/public/images/producthunt.svg';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Spinner } from './spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../auth-provider';
import { updateUserFromUser } from '@/lib/services/userService';

const contactFormSchema = z.object({
  nickname: z
    .string()
    .nonempty('Name/Nickanme cannot be empty.')
    .max(50, 'Name/Nickname cannot be more than 50 characters.'),
  email: z
    .string()
    .nonempty('Email address cannot be empty.')
    .email('Invalid email address'),
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
  const { toast } = useToast();
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (user) {
      user.nickname && form.setValue('nickname', user.nickname);
      user.email && form.setValue('email', user.email);
    }
  }, [user]);

  const onValid = async (values: z.infer<typeof contactFormSchema>) => {
    try {
      setIsSendingEmail(true);
      await sendEmail(values.nickname, values.email, values.message);
      toast({ title: 'Email is sent successfully!' });
      form.reset();
    } catch (error) {
      toast({ title: error.message });
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
              <form
                onSubmit={form.handleSubmit(onValid)}
                className='flex flex-col gap-4'
              >
                <FormField
                  control={form.control}
                  name='nickname'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How do we address you?</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Your name / nickname...'
                          {...field}
                        />
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
                        <Input
                          type='email'
                          placeholder='Your email address'
                          {...field}
                        />
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

            <div className='w-full flex flex-col lg:flex-row gap-4 items-center'>
              <a
                className='hover:opacity-70 hover:scale-105 transition-all rounded-md'
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
              <a
                className='hover:opacity-70 hover:scale-105 transition-all rounded-md'
                href='https://www.producthunt.com/products/taboo-ai?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-taboo&#0045;ai'
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  alt='Taboo&#0046;AI - Taboo&#0046;AI&#0032;&#0045;&#0032;The&#0032;Ultimate&#0032;Wordplay&#0032;Challenge&#0032;against&#0032;AI | Product Hunt'
                  width='240'
                  height='50'
                  src={ProductHuntBadge}
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
