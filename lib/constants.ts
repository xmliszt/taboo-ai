export const CONSTANTS = {
  numberOfQuestionsPerGame: 3,
  errors: {
    overloaded: 'Taboo AI is currently overloaded with other requests. Please try again later.',
    aiModeTopicTooFew:
      'Sorry, Taboo AI is unable to generate the topic right now. Please try again.',
  },
};

export type RejectionReason =
  | 'inappropriate_content'
  | 'ambiguous_topic'
  | 'duplicate_topic'
  | 'insufficient_word_variety'
  | 'inaccurate_topic_name'
  | 'non_english_topic';

export const REJECTIONS: Record<
  RejectionReason,
  {
    title: string;
    message: string;
  }
> = {
  inappropriate_content: {
    title: 'Inappropriate Content',
    message:
      'We strive to maintain a friendly and inclusive environment for players of all ages. Unfortunately, your topic contains content that may not align with our community standards. Please feel free to submit other topics that are suitable for a wider audience.',
  },
  ambiguous_topic: {
    title: 'Ambiguity and Lack of Clarity',
    message:
      "Your topic's target words and associated taboo words lacked clarity, making the gameplay confusing and less enjoyable for users. To enhance the gaming experience, please consider providing more concise and clear definitions for future submissions.",
  },
  non_english_topic: {
    title: 'Non-English Topic',
    message:
      'We only accept topics in English for now. Please submit a topic in English for future submissions.',
  },
  duplicate_topic: {
    title: 'Duplicate Topic',
    message:
      'We already have a similar topic in our database, and to avoid repetition, we have decided not to accept duplicate entries. We encourage you to explore other unique topics to share with the Taboo AI community.',
  },
  insufficient_word_variety: {
    title: 'Insufficient Word Variety',
    message:
      'Your submission contained limited word choices, which may limit the diversity of gameplay. Please consider adding more words or exploring broader themes for your next submission.',
  },
  inaccurate_topic_name: {
    title: 'Inaccurate Topic Name',
    message:
      'The topic name you provided does not accurately relate to the target words submitted. Please revise the topic name to better reflect the theme of the target words in your Taboo AI contribution.',
  },
};
