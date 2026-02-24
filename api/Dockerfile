# api/Dockerfile
FROM oven/bun:1.1.8

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

EXPOSE 3001

CMD ["bun", "run", "start"]