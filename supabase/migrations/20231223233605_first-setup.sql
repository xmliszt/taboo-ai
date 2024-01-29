-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension for CITEXT type
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create custom type customer_plan_type: 'free' | 'pro'
create type customer_plan_type as enum (
    'free',
    'pro'
);

create type conversation_chat_role as enum (
    'user',
    'assistant',
    'system',
    'error'
);

create table if not exists users (
    id uuid default uuid_generate_v4(),
    email citext not null,
    name varchar(255) not null,
    nickname varchar(255),
    photo_url varchar(255),
    first_login_at timestamptz default now() not null,
    last_login_at timestamptz default now() not null,
    PRIMARY KEY (id)
);

create table if not exists levels
(
    id uuid default uuid_generate_v4(),
    name varchar(255) not null,
    -- created_by could be `null` because old levels were not created by a user
    created_by uuid default null,
    created_at timestamptz default now() not null,
    difficulty int not null,
    popularity int default 0 not null,
    is_new boolean default true not null,
    is_verified boolean default false not null,
    words citext[] not null,
    PRIMARY KEY (id),
    foreign key (created_by) references public.users(id) on delete set null,
    check ( difficulty between 1 and 3 ),
    check ( array_length(words, 0) >= 3 )
);

create table if not exists words (
    word citext not null,
    taboos citext[] not null,
    is_verified boolean default false not null,
    updated_at timestamptz default now() not null,
    PRIMARY KEY (word)
);

create table if not exists subscriptions (
    user_id uuid unique not null,
    customer_id varchar(255) unique,
    customer_plan_type customer_plan_type default 'free' not null,
    FOREIGN KEY (user_id) REFERENCES public.users(id) on delete cascade
);

create table if not exists games (
    id uuid default uuid_generate_v4() not null,
    -- level_id is nullable here, if it is null, it indicates a custom game
    level_id uuid,
    user_id uuid not null,
    started_at timestamptz default now() not null,
    finished_at timestamptz default null,
    primary key (id),
    foreign key (level_id) references public.levels(id) on delete no action,
    foreign key (user_id) references public.users(id) on delete cascade
);

create table if not exists game_scores (
    id uuid default uuid_generate_v4() not null,
    game_id uuid not null,
    target_word citext not null,
    primary key (id),
    foreign key (game_id) references public.games(id) on delete cascade,
    foreign key (target_word) references public.words(word) on delete no action on update cascade
);

create table if not exists game_ai_evaluations (
    score_id uuid not null,
    ai_score decimal not null,
    ai_explanation text not null,
    ai_suggestion text,
    foreign key (score_id) references public.game_scores(id) on delete cascade
);

create table if not exists game_score_conversations (
    id uuid default uuid_generate_v4() not null,
    score_id uuid not null,
    role conversation_chat_role not null,
    content text not null,
    primary key (id),
    foreign key (score_id) references public.game_scores(id) on delete cascade
);

create table if not exists game_score_highlights (
    id uuid default uuid_generate_v4() not null,
    score_id uuid not null,
    start_position int not null,
    end_position int not null,
    primary key (id),
    foreign key (score_id) references public.game_scores(id) on delete cascade
);

create table if not exists curated_level_category (
    name citext not null,
    primary key (name)
);

create table if not exists curated_levels (
    id uuid default uuid_generate_v4() not null,
    name varchar(255) not null,
    -- each curated level can be categorised, un-categorised level will fall under "uncategorized"
    category citext,
    -- curated levels all have a cover image
    cover_image_url citext not null,
    -- curated levels are created by Taboo AI, therefore there is no need for created_at
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    difficulty int not null,
    words citext[] not null,
    PRIMARY KEY (id),
    -- if a category is deleted, we keep the curated levels under the category
    foreign key (category) references public.curated_level_category(name) on update cascade on delete set null,
    check ( difficulty between 1 and 3 ),
    check ( array_length(words, 0) >= 3 )
);