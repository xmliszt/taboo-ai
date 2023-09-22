import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Spinner } from './spinner';
import { DialogProps } from '@radix-ui/react-dialog';
import _ from 'lodash';
import { useState } from 'react';
import IUser from '@/lib/types/user.type';
import { cn } from '@/lib/utils';
import { addLevel, isLevelExists } from '@/lib/services/levelService';
import { sendEmail } from '@/lib/services/emailService';
import { updateUserFromUser } from '@/lib/services/userService';
import { addTabooWords } from '@/lib/services/wordService';
import { useToast } from '../ui/use-toast';

interface TopicReviewSheet extends DialogProps {
  user: IUser;
  topicName: string;
  difficultyLevel: string;
  shouldUseAIForTabooWords: boolean;
  targetWords: string[];
  defaultNickname: string;
  isAIGenerated?: boolean;
  tabooWords?: string[][];
  onTopicSubmitted?: () => void;
}

export function TopicReviewSheet({
  open,
  user,
  topicName,
  difficultyLevel,
  defaultNickname,
  shouldUseAIForTabooWords,
  isAIGenerated = false,
  targetWords,
  tabooWords = [],
  onTopicSubmitted,
  onOpenChange,
}: TopicReviewSheet) {
  const { toast } = useToast();
  const [nickname, setNickname] = useState(defaultNickname);
  const [isCreatingLevel, setisCreatingLevel] = useState(false);

  const submitNewTopic = async () => {
    setisCreatingLevel(true);
    try {
      const exists = await isLevelExists(topicName, user.email);
      if (exists) {
        toast({ title: 'You have already submitted this topic.' });
        onTopicSubmitted && onTopicSubmitted();
        return;
      }
      await addLevel({
        name: topicName,
        difficulty: Number(difficultyLevel),
        words: targetWords.map((w) => _.toLower(_.trim(w))),
        author: nickname,
        authorEmail: user.email,
        isNew: true,
      });
      await updateUserFromUser({
        email: user.email,
        nickname: nickname,
      });
      if (!shouldUseAIForTabooWords)
        for (let i = 0; i < tabooWords.length; i++) {
          const wordList = tabooWords[i];
          const targetWord = targetWords[i];
          await addTabooWords(targetWord, wordList, false, user.email);
        }

      await sendMyselfEmail();
      toast({
        title:
          'Your topic has been submitted for review. The outcome of the submission will be notified via email.',
      });
      onTopicSubmitted && onTopicSubmitted();
    } catch (error) {
      toast({
        title: 'Sorry, we are unable to submit the topic at the moment!',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setisCreatingLevel(false);
      onOpenChange && onOpenChange(false);
    }
  };

  const sendMyselfEmail = async () => {
    const email = user.email;
    const name = nickname || 'anonymous';
    try {
      await sendEmail(
        name,
        email,
        `${email} has submitted a new topic!`,
        `Taboo AI New Topic Submission: ${email} has submitted a new topic!`,
        `<article>
        <h1>New Topic Submitted: <b>${topicName}</b></h1>
        <div>
            <p>Nickname: ${name}</p>
            <p>Email: ${email}</p>
            <p>Topic Name: <b>${topicName}</b></p>
        </div>
        <br/>
        ${targetWords.map(
          (w, i) => `
          <hr/>
          <h2>Target: ${w}</h2>
          <h3>Difficulty Level: ${difficultyLevel}</h3>
          ${
            shouldUseAIForTabooWords
              ? '<div>This user has opted in for AI to generate taboo words.</div>'
              : tabooWords[i].map((tw) => `<div>${tw}</div>`)
          }
        `
        )}
        </article>`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='bottom'
        className='leading-snug h-full overflow-y-auto'
      >
        <SheetHeader>
          <SheetTitle className='flex flex-col gap-1 justify-center'>
            Review Your Topic:{' '}
            <b className='ml-2 text-2xl font-extrabold'>{topicName}</b>
          </SheetTitle>
        </SheetHeader>
        <div className='flex flex-wrap gap-8 mt-4 justify-center'>
          {targetWords.map((w, i) => (
            <Card key={i} className='max-w-[300px]'>
              <CardHeader className='text-center text-2xl font-bold p-2'>
                <CardTitle className='bg-secondary py-4 rounded-lg shadow-md'>
                  {_.startCase(_.trim(w))}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-center mt-2'>
                {isAIGenerated === true ? (
                  <p>
                    This topic is AI generated. Hence the taboo words will be
                    generated by AI as well.
                  </p>
                ) : shouldUseAIForTabooWords ? (
                  <p>
                    You chose to use AI to generate the taboo words. Your taboo
                    words will be ready once the submission passes the review.
                  </p>
                ) : (
                  tabooWords !== undefined && (
                    <>
                      <p className='text-red-400'>Taboo Words:</p>
                      <div className='flex flex-wrap gap-4 mt-4'>
                        {tabooWords[i]
                          .filter((w) => w.length > 0)
                          .map((tw, ti) => (
                            <Badge key={ti}>{tw}</Badge>
                          ))}
                      </div>
                    </>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='flex flex-col gap-2 my-4'>
          <Label htmlFor='email-input'>Contributor email: </Label>
          <Input disabled id='email-input' defaultValue={user.email} />
        </div>
        <div className='flex flex-col gap-2 my-4'>
          <Label htmlFor='nickname-input'>Nickname: </Label>
          <Input
            id='nickname-input'
            value={nickname}
            maxLength={20}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
            className={cn(
              _.trim(nickname).length <= 0
                ? '!border-red-500'
                : '!border-border'
            )}
          />
          <p className='text-muted-foreground text-xs'>
            Nickname will be displayed under the successfully contributed topic
            and visible to all players.
          </p>
        </div>
        <div className='flex justify-center'>
          {isCreatingLevel ? (
            <Button disabled>
              <Spinner />
            </Button>
          ) : (
            <Button
              disabled={_.trim(nickname).length <= 0}
              className='mb-4'
              aria-label='click to submit the topic created'
              onClick={submitNewTopic}
            >
              Submit Topic
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
