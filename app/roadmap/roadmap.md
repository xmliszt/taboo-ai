# Taboo AI Releases Roadmap

## Release Notes (V3.0)

### 30 Jan 2023 - V3.1.5

- Important database migration from Firebase to Supabase.
- Bug fixes & UI improvements.
- Introduce pricing plans.
- Revamp home screen.
- Add "/publications" page.
- Revamp user login and user profile page.

### 01 Jan 2023 - V3.1.4

- Improve log in experience.
- Bug fixes.

### 17 Dec 2023 - V3.1.3

- Integrate Google Gemini Pro API into Taboo AI.
- Bug fixes.

### 19 Nov 2023 - V3.1.2

- Profile page has a new section for user to view the played topics and quick access to play them!
- Update some information on the app
- Update greeting messages
- Fix issue where nickname is not in sync
- Fix issue where results are not uploaded successfully
- Fix issue where user account deletion does not delete public ranks

### 18 Nov 2023 - V3.1.1

- Topics page can toggle to view best score and top scorer instead
- Profile page add Privacy Settings section for user to toggle anonymity option
- Topics page add scrollbar for easier navigation

### 16 Nov 2023 - V3.1.0

- AI Evaluation with Feedback Improvements
- Profile Page opened (for signed in user)
- Change nickname at profile page (for signed in user)
- View 5 past games (for signed in user)
- View game statistics (for signed in user)

### 05 Nov 2023 - V3.0.14

- Smart AI score evaluation
- New page /about for quick introdution to Taboo AI

### 04 Nov 2023 - V3.0.13

- Open profile page for user to edit nickname and delete account.
- More features are still in development.

### 28 Oct 2023 - V3.0.12

- Fix issue where total time taken not showing if scores not judged completely.
- Increase Google auth browser persistence level to local instead of session.

### 28 Oct 2023 - V3.0.11

- Patches for minor bug fixes.
- More intuitive icon for "follow system theme" toggle.
- Refactoring.

### 21 Oct 2023 - V3.0.10

- Better sharing of result with Taboo AI Share Card!
- Result improved with star ratings. Better visualization of how the player performed.
- Include newsletter link to subscribe from SubStack.

### 19 Oct 2023 - V3.0.9

- Fix level loaded multiple times, causing target word to flicker.
- Update PWA manifest

### 14 Oct 2023 - V3.0.8

- Minor bug fixes.
- Added GitHub open source repo link.

### 30 Sep 2023 - V3.0.7

- Dynamic sitemap endpoint for other file type
- Upgrade nextjs to 13.5

### 27 Sep 2023 - V3.0.6

- Sitemap page
- Add feature badge for "AIBRB.com"
- Add view counter on home page
- Bug fixes

### 22 Sep 2023 - V3.0.5

- Side menu will restore locations for "Contribute A Topic" and "See Your Result".
- Minor bug fixes.

### 16 Sep 2023 - V3.0.4

- Convenient way to allow topic generated from AI Mode to be contributed by providing logged in user the option to
  submit the level.
- Logged in user is able to view his/her last result from Home, Menu or User Menu. The last result is restored from
  browser cache, therefore, logging out and log back in, or switch user, or clear browser cache, will remove the saved
  result and unable to view.
- Greatly improve the performance of Taboo AI. Now it loads much faster.
- Some UI improvements. E.g. AI prompt when thinking is animated, etc.

### 13 Sep 2023 - V3.0.3

- Add more sorting methods: sort by easiest or hardest level first.
- Results page accordion component is added with indications for user to expand / fold. Default the first item will be
  opened.
- User login that is blocked by browser will now alerted with a popup, providing "try again" option to attempt again (
  usually second attempt will not be blocked by browser anymore...)
- Some bug fixes.

### 12 Sep 2023 - V3.0.2

- Improve conversation AI to be more specific to answering user's prompts in the settings of playing a Taboo Game.
- Some bug fixes.

### 11 Sep 2023 - V3.0.1

- Updated Privacy Policy and Cookies Policy

### 10 Sep 2023 - V3.0.0

- **Revamped UI/UX**: Say hello to a sleek and intuitive interface that makes navigating Taboo AI a breeze. Experience
  the charm of classic typography brought to life! Our new design invokes a sense of nostalgia while providing a
  seamless and intuitive experience. Enjoy a seamless and engaging experience from start to finish.
- **Dark/Light Mode**: Tailor your gaming environment to suit your style. Whether you prefer a dark or light backdrop,
  Taboo AI now supports both modes for your convenience.
- **Dynamic Gameplay**: Engage in "conversation mode" with the AI, turning your sessions into dynamic exchanges. No more
  one-question-one-answer routines. Keep the conversation flowing while cleverly coaxing out the 'taboo word'.
- **Detailed Results**: The results page now offers comprehensive logs of your conversations. Save and share your entire
  gaming session with friends to relive those memorable moments.
- **User Login and Authentication**: For those eager to contribute topics, now you can! Securely log in with your Google
  Account (more platforms will be included in later releases...) and share your creative ideas with the Taboo AI
  community.
- **Enhanced Topic Selection**: Finding your preferred topics has never been easier. Sort by various criteria, and see
  which topics are most popular. Discover what fellow players are diving into!
- **Streamlined Menu**: Everything you need is right at your fingertips. Navigate through a comprehensive menu that
  covers every functionality Taboo AI has to offer.

## 28 Aug - Release Notes (V2.10)

- Fresh new look for the topics page - flashcard design, that is easy to understand.
- Search topics will include results count at the bottom of the search bar.

## 30 Jul - Release Notes (V2.9)

- Brand new feature: a place for you to conveniently submit topics for others to play!
- More user-friendly UI.
- Update "Privacy Policy". We might collect email addres of you to process your feedbacks and topics submitted.

## 26 Jul - Release Notes (V2.8)

- Removed ads.
- More user-friendly UI.
- Update "Privacy Policy" by adding "Microsoft Clarity".

## 23 Jul - Release Notes (V2.7)

- Removed "Daily Challenge" and "Leaderboard".
- Added non-intrusive, closeable ads.
- Added instructions on how to install Taboo AI as Progressive Web App (PWA) on Home Screen.
- Added "Contact Me" section, for players to submit custom word list, or any feedbacks.

## 06 Jul - Release Notes (V2.6)

- Taboo AI made simpler with 3 instead of 5 stages per game.
- Fixed daily challenge result not shown if not logged in.

## 20 Jun - Release Notes (V2.5)

- Improved AI scoring.
- Fixed normal level not loading.
- Fixed normal result page not showing.

## 18 Jun - Release Notes (V2.4)

- **Progressive Web App (PWA)**.

## 17 Jun - Release Notes (V2.3)

- **Recovery Key** now can be copied directly by clicking on your **nickname** once signed in, on Home Page.
- Remove `/daily-challenge/loading`

## 31 May - Release Notes (V2.2)

- **Improved AI scoring system**.
- Minor bug fixes.

## 06 Apr - Release Notes (V2.1)

- **New scoring system** ensures that players will be rewarded for their **overall performance**, rather than just their
  speed.
- Added **topic name** for daily challenge in the Wall of Fame (leaderboard).
- In **result** page, now user can unfold/fold the result of each stage, so that the overview will not be too long to
  scroll. User can expand and see the details if want to.
- In **result** page, added button with question mark to review the new scoring system rules.
- Remove **word carousell background** as it is CPU intensive. Will replace with light video in the future.
- In game **timer** will flash **yellow** and **red** color based on time lapsed.

## 02 Apr - Release Notes (V2.0)

- **Brand New Daily Challenge mode** with **Wall of Fame (Leaderboard)** for players to compete.
- **Nickname creation** for players to create their unique nicknames.
- **Recovery mode** for players who want to restore their game records on **new devices** or when they **switch to new
  browsers** or clear cache in existing browser.
- **Search** function added to "Topic Selection" page.
- **Anti-Cheat** measures are implemented to ensure fairness of the daily challenge compeition.
- Improved UI.

## 22 Feb - Release Notes (V1.4)

- Improved **AI response** by altering prompts.
- Improved **AI generated taboo words**.
- More **meaningful** text in the game. (e.g. "TABOO: word" changed to "Make AI Say: word")
- **Persistent** light/dark theme. Your last theme will be saved and restored when you come back.
- Fixed timer issue when player re-submit prompt again after unsuccessful attempt.

## 19 Feb - Release Notes (V1.3)

- Version number indicator to inform players about version updates.
- **OpenAI API free trial ended**. Started paid subscription to continue use the Curie model to provide users with
  smooth gameplay experience.
- Added **"Buy Me Coffee"** to call for kind supports from the players. If you like this game, can buy me a coffee so
  that I can continue to maintain the game and update it to bring more fun and exciting features to you! **Thank you for
  your kind support** ❤️!
- Disclaimer for possible internet hiccups due to the **overloaded OpenAI service**.
- AI prompts improvements.
- Overall fonts update.

## 16 Feb - Release Notes (V1.2)

- Improve user experience.
- Use AI to generate a list of **relevant taboo words** associated with the target word, making Taboo more **fun** and
  more **challenging**!
- **Countdown timer** for player to prepare while AI is generating the list of taboo words.
- Result scoreboard supports **target word highlighting**. Better **sharing mechanism**. Fix text gets offset when
  taking the screenshots.
- **Timer status indicator** to inform players.
- **More descriptive messages** for alerts, input placeholders.
- **Clear button** for input to easily clear the prompt.
- **Words carousell** background.
- UI improvements.
- Minor bug fixes.

---

## 31 Jan - Release Notes (V1.1)

- **More pre-defined topics** to choose from!
- Open for players to **submit their own taboo word list** to share with others.
- UI improvements.
- Minor bug fixes.

---

## 16 Jan - First Release Notes (V1.0)

- Taboo AI **first release**!
- **Pre-defined topics** of taboo words.
- **AI mode** to allow player to suggest a topic and AI will generate the taboo words from that topic, providing more *
  *customization** to the game.
- **Timer** scoring system.
- Integrated with **ChatGPT AI** to respond your questions.
- Smart system to **match** and **verify** if you hit the taboo words or AI hits the taboo words.
- **Result scoreboard** to revisit your journey! Sharing screenshot is provided too!
- **Light & Dark mode**.
- BETA testing with **feedback** submission.
