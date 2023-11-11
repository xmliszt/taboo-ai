'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { sendEmail } from '@/lib/services/emailService';
import { useToast } from '../../ui/use-toast';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Spinner } from '../spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../auth-provider';

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
    } else {
      form.reset();
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

            <div className='w-full flex flex-row flex-wrap gap-4 justify-center'>
              <a
                className='hover:opacity-70 hover:scale-105 transition-all rounded-md'
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
                className='hover:opacity-70 hover:scale-105 transition-all rounded-md'
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
                href='https://aibrb.com/taboo-ai-a-cutting-edge-ai-powered-game-for-language-learning-and-fun/'
              >
                <Image
                  className='rounded-md border-[1px] border-gray-300 py-1 bg-white'
                  alt='Taboo.AI: A Cutting-Edge AI-Powered Game for Language Learning and Fun | Featured on AIBRB.COM'
                  src='https://aibrb.com/wp-content/uploads/2023/09/Featured-on-AIBRB.com-white.png'
                  width='240'
                  height='50'
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
