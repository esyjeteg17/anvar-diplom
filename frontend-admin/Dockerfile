# Образ для админ-панели SBORIKA (Nuxt 4).
# Многоэтапная сборка: builder ставит зависимости и собирает Nuxt,
# финальный образ содержит только готовый .output для запуска.

# --- Этап 1: сборка ---
FROM node:20-alpine AS builder

WORKDIR /app

# Сначала только манифесты — кэш слоёв npm ci переиспользуется.
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходники и собираем Nuxt.
COPY . .
RUN npm run build

# --- Этап 2: рантайм ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4041

# Берём только готовую сборку — node_modules уже внутри .output.
COPY --from=builder /app/.output ./.output

EXPOSE 4041

# Стандартная точка входа Nuxt-приложения после `nuxt build`.
CMD ["node", ".output/server/index.mjs"]
