// Service Worker para FitTransform PWA com Notificações
const CACHE_NAME = "fittransform-v1"
const urlsToCache = ["/", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg"]

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Estratégia: Network First, fallback para Cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      }),
  )
})

let notificationSettings = null
let notificationTimers = []

// Receber mensagens do cliente para agendar notificações
self.addEventListener("message", (event) => {
  if (event.data.type === "SCHEDULE_NOTIFICATIONS") {
    notificationSettings = event.data.settings
    scheduleAllNotifications()
  }
})

function scheduleAllNotifications() {
  // Limpar timers anteriores
  notificationTimers.forEach((timer) => clearTimeout(timer))
  notificationTimers = []

  if (!notificationSettings) return

  // Agendar notificações de hidratação
  if (notificationSettings.water_notifications_enabled) {
    scheduleWaterNotifications()
  }

  // Agendar notificações de treino
  if (notificationSettings.workout_notifications_enabled) {
    scheduleWorkoutNotifications()
  }
}

function scheduleWaterNotifications() {
  const intervalMs = notificationSettings.water_interval_hours * 60 * 60 * 1000
  const now = new Date()

  const [startHour, startMinute] = notificationSettings.water_start_time.split(":")
  const [endHour, endMinute] = notificationSettings.water_end_time.split(":")

  const startTime = new Date(now)
  startTime.setHours(Number.parseInt(startHour), Number.parseInt(startMinute), 0, 0)

  const endTime = new Date(now)
  endTime.setHours(Number.parseInt(endHour), Number.parseInt(endMinute), 0, 0)

  // Agendar próxima notificação de água
  const scheduleNext = () => {
    const currentTime = new Date()

    if (currentTime >= startTime && currentTime <= endTime) {
      self.registration.showNotification("💧 Hora de Beber Água!", {
        body: "Mantenha-se hidratado! Beba um copo de água agora.",
        icon: "/icon-192.jpg",
        badge: "/icon-192.jpg",
        tag: "water-reminder",
        vibrate: [200, 100, 200],
      })
    }

    const timer = setTimeout(scheduleNext, intervalMs)
    notificationTimers.push(timer)
  }

  // Calcular tempo até primeira notificação
  const msUntilStart = startTime > now ? startTime - now : 0
  const timer = setTimeout(scheduleNext, msUntilStart)
  notificationTimers.push(timer)
}

function scheduleWorkoutNotifications() {
  const now = new Date()
  const dayOfWeek = now.getDay()

  // Notificação de Academia
  if (notificationSettings.gym_time && notificationSettings.gym_days?.includes(dayOfWeek)) {
    scheduleWorkoutNotification(
      notificationSettings.gym_time,
      "🏋️ Hora do Treino!",
      "Está na hora de ir para a academia!",
      "gym-reminder",
    )
  }

  // Notificação de Corrida
  if (notificationSettings.running_time && notificationSettings.running_days?.includes(dayOfWeek)) {
    scheduleWorkoutNotification(
      notificationSettings.running_time,
      "🏃 Hora da Corrida!",
      "Vista seu tênis e vamos correr!",
      "running-reminder",
    )
  }

  // Notificação de Treino em Casa
  if (notificationSettings.home_workout_time && notificationSettings.home_workout_days?.includes(dayOfWeek)) {
    scheduleWorkoutNotification(
      notificationSettings.home_workout_time,
      "💪 Treino em Casa!",
      "Hora de se exercitar em casa!",
      "home-workout-reminder",
    )
  }
}

function scheduleWorkoutNotification(timeString, title, body, tag) {
  const now = new Date()
  const [hour, minute] = timeString.split(":")

  const workoutTime = new Date(now)
  workoutTime.setHours(Number.parseInt(hour), Number.parseInt(minute), 0, 0)

  // Se o horário já passou hoje, agendar para amanhã
  if (workoutTime <= now) {
    workoutTime.setDate(workoutTime.getDate() + 1)
  }

  const msUntilWorkout = workoutTime - now

  const timer = setTimeout(() => {
    self.registration.showNotification(title, {
      body: body,
      icon: "/icon-192.jpg",
      badge: "/icon-192.jpg",
      tag: tag,
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
    })
  }, msUntilWorkout)

  notificationTimers.push(timer)
}

// Lidar com cliques em notificações
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Se já tem uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus()
        }
      }
      // Caso contrário, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow("/")
      }
    }),
  )
})
