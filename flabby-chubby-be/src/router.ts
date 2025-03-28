import { FastifyInstance } from "fastify";
import db from "./db";
import { leagues, leagueMembers, scores, users } from "./db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const adjectives = [
  "Happy",
  "Silly",
  "Clever",
  "Brave",
  "Gentle",
  "Witty",
  "Calm",
  "Kind",
  "Proud",
  "Swift",
];

const nouns = [
  "Panda",
  "Dolphin",
  "Eagle",
  "Tiger",
  "Lion",
  "Wolf",
  "Bear",
  "Fox",
  "Hawk",
  "Owl",
];

function generateRandomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}`;
}

export default async function router(fastify: FastifyInstance) {
  // User routes
  fastify.post("/users", async (request, reply) => {
    const { device_type } = request.body as {
      device_type: (typeof users.$inferInsert)["device_type"];
    };
    const device_id = uuidv4();
    const name = generateRandomName();

    const [user] = await db
      .insert(users)
      .values({
        device_id,
        device_type,
        name,
      })
      .returning();
    console.log(user);
    return reply.send(user);
  });

  fastify.put("/users/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { name } = request.body as { name: string };

    const [updatedUser] = await db
      .update(users)
      .set({ name, updated_at: new Date() })
      .where(eq(users.user_id, userId))
      .returning();

    if (!updatedUser) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send(updatedUser);
  });

  fastify.get("/users/:userId/scores", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const [latestScores, topScores] = await Promise.all([
      db
        .select()
        .from(scores)
        .where(eq(scores.user_id, userId))
        .orderBy(desc(scores.created_at))
        .limit(20),
      db
        .select()
        .from(scores)
        .where(eq(scores.user_id, userId))
        .orderBy(desc(scores.score))
        .limit(3),
    ]);

    return reply.send({ latestScores, topScores });
  });

  // League routes
  fastify.post("/leagues", async (request, reply) => {
    const { owner_id, title } = request.body as {
      owner_id: string;
      title: string;
    };

    const [league] = await db
      .insert(leagues)
      .values({
        owner_id,
        title,
      })
      .returning();

    // Add owner as a league member
    await db.insert(leagueMembers).values({
      league_id: league.league_id,
      user_id: owner_id,
    });

    return reply.send(league);
  });

  fastify.get("/leagues/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const result = await db.execute(sql`
      with user_leagues as (
      select league_id
      from flabby.league_members lm
      where lm.user_id = ${userId}
    ),
    league_users as (
      select
        lm.league_id,
        u.user_id,
        u.name,
        max(s.score) as top_score
      from flabby.league_members lm
      join flabby.users u on u.user_id = lm.user_id
      left join flabby.scores s on s.user_id = u.user_id
      where lm.league_id in (select league_id from user_leagues)
      group by lm.league_id, u.user_id, u.name
    ),
    ranked_users as (
      select *,
        rank() over (
          partition by league_id
          order by top_score desc nulls last
        ) as rnk
      from league_users
    )
    select
      l.league_id,
      l.title,
      json_agg(
        json_build_object(
          'user_id', ru.user_id,
          'name', ru.name,
          'top_score', ru.top_score
        )
        order by ru.top_score desc nulls last
      ) filter (where ru.rnk <= 5) as top_users
    from flabby.leagues l
    join user_leagues ul on ul.league_id = l.league_id
    join ranked_users ru on ru.league_id = l.league_id
    group by l.league_id, l.title
    order by l.title;`);

    return reply.send(result);
  });

  fastify.post("/leagues/join", async (request, reply) => {
    const { userId, leagueId } = request.body as {
      userId: string;
      leagueId: string;
    };

    try {
      // Check if the user is already a member of the league
      const existingMember = await db.query.leagueMembers.findFirst({
        where: (leagueMembers, { eq }) =>
          eq(leagueMembers.league_id, leagueId) &&
          eq(leagueMembers.user_id, userId),
      });

      if (existingMember) {
        return reply
          .status(200)
          .send({ success: true, message: "Already a member" });
      }

      // Add the user to the league
      await db.insert(leagueMembers).values({
        league_id: leagueId,
        user_id: userId,
      });

      return reply
        .status(200)
        .send({ success: true, message: "Successfully joined league" });
    } catch (error) {
      console.error("Failed to join league:", error);
      return reply
        .status(500)
        .send({ success: false, error: "Failed to join league" });
    }
  });

  // Score routes
  fastify.post("/scores", async (request, reply) => {
    const { user_id, score, league_id } = request.body as {
      user_id: string;
      score: number;
      league_id?: string;
    };

    // Create scores for user's own leagues
    const scorePromises = [
      db.insert(scores).values({
        user_id,
        score,
      }),
    ];

    await Promise.all(scorePromises);

    return reply.send({ success: true });
  });

  fastify.get("/health", async (request, reply) => {
    return reply.send({ status: "ok" });
  });

  // Get user's login token
  fastify.get("/users/:userId/login-token", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const [user] = await db
      .select({ login_token: users.login_token })
      .from(users)
      .where(eq(users.user_id, userId));

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send(user);
  });

  // Check if user exists
  fastify.get("/users/:userId/exists", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const [user] = await db
      .select({ user_id: users.user_id })
      .from(users)
      .where(eq(users.user_id, userId));

    if (!user) {
      return reply.status(404).send({ exists: false });
    }

    return reply.send({ exists: true });
  });

  // Get user by login token
  fastify.get("/users/login/:loginToken", async (request, reply) => {
    const { loginToken } = request.params as { loginToken: string };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.login_token, loginToken));

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send(user);
  });
}
