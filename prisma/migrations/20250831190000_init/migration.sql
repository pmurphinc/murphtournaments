CREATE TYPE "Role" AS ENUM ('USER','STAFF','ADMIN');
CREATE TYPE "TournamentStatus" AS ENUM ('DRAFT','REGISTRATION','CHECKIN','LIVE','FINISHED','ARCHIVED');
CREATE TYPE "QStatus" AS ENUM ('OPEN','ANSWERED','CLOSED');
CREATE TYPE "MatchStatus" AS ENUM ('PENDING','READY','LIVE','DONE','VOID');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "discordId" TEXT NOT NULL UNIQUE,
  "email" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER'
);

CREATE TABLE "Tournament" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "status" "TournamentStatus" NOT NULL DEFAULT 'DRAFT',
  "startsAt" TIMESTAMP,
  "checkInOpensAt" TIMESTAMP,
  "rosterLockAt" TIMESTAMP,
  "rules" TEXT,
  "maxTeams" INTEGER
);

CREATE TABLE "Team" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "tournamentId" TEXT NOT NULL REFERENCES "Tournament"("id") ON DELETE CASCADE,
  "captainId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "approved" BOOLEAN NOT NULL DEFAULT FALSE,
  "notes" TEXT
);

CREATE TABLE "TeamMember" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "teamId" TEXT NOT NULL REFERENCES "Team"("id") ON DELETE CASCADE,
  "displayName" TEXT NOT NULL,
  "embarkId" TEXT NOT NULL,
  "isSub" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Question" (
  "id" TEXT PRIMARY KEY,
  "authorId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "tournamentId" TEXT,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "tags" TEXT[] NOT NULL,
  "status" "QStatus" NOT NULL DEFAULT 'OPEN',
  "officialAnswerId" TEXT
);

CREATE TABLE "Answer" (
  "id" TEXT PRIMARY KEY,
  "questionId" TEXT NOT NULL REFERENCES "Question"("id") ON DELETE CASCADE,
  "authorId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
  "body" TEXT NOT NULL,
  "official" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Match" (
  "id" TEXT PRIMARY KEY,
  "tournamentId" TEXT NOT NULL REFERENCES "Tournament"("id") ON DELETE CASCADE,
  "round" INTEGER NOT NULL,
  "bestOf" INTEGER NOT NULL,
  "startAt" TIMESTAMP,
  "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
  "hostId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "teamAId" TEXT,
  "teamBId" TEXT,
  "scoreA" INTEGER,
  "scoreB" INTEGER
);