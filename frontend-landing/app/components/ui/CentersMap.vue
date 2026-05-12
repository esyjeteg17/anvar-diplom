<script setup lang="ts">
/**
 * Интерактивная карта партнёрских центров на Leaflet + OpenStreetMap.
 *
 * Карта инициализируется только на клиенте — Leaflet импортируется динамически
 * в onMounted, а сам блок карты рендерится через <ClientOnly> в родителе.
 *
 * При наведении на метку (DOM-событие mouseenter на самой шестерёнке)
 * над меткой показывается кастомный Vue-tooltip с названием и адресом.
 * Используем не bindTooltip Leaflet, а собственный reactive-блок —
 * через Leaflet эти события через DivIcon работают непредсказуемо.
 */

import type { Map as LMap, Marker as LMarker } from "leaflet"

interface MapPoint {
  lat: number
  lng: number
  title: string
  address: string
}

const props = defineProps<{
  points: MapPoint[]
}>()

const mapEl = ref<HTMLDivElement | null>(null)
const initError = ref<string | null>(null)
const markersCount = ref<number>(0)

// Точка под курсором + её позиция в пикселях относительно контейнера карты.
// Используется для рендера кастомного tooltip-блока поверх карты.
const hovered = ref<MapPoint | null>(null)
const hoveredPos = ref<{ x: number; y: number } | null>(null)

let mapInstance: LMap | null = null
let markers: LMarker[] = []

onMounted(async () => {
  if (!mapEl.value) {
    initError.value = "DOM-узел карты не найден"
    return
  }
  if (props.points.length === 0) {
    initError.value = "Нет точек для отображения"
    return
  }

  try {
    // Динамический импорт Leaflet. Берём default-экспорт если он есть.
    const mod: any = await import("leaflet")
    const L: any = mod.default ?? mod

    if (typeof L.map !== "function") {
      throw new Error("Leaflet не экспортирует L.map — проблема с импортом")
    }

    // Инициализация карты. attributionControl: false — убирает нижний правый
    // блок атрибуции (там же отображается флажок Украины от OSM Foundation),
    // что неприемлемо для дипломной защиты.
    // Центр и зум подобраны так, чтобы при первом открытии все 4 центра
    // были видны крупно (восточная часть Москвы), а не вся Москва целиком.
    mapInstance = L.map(mapEl.value, {
      center: [55.7628, 37.7821],
      zoom: 12,
      scrollWheelZoom: false,
      attributionControl: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapInstance)

    const gearSvg = `
      <svg viewBox="-54 -54 108 108" xmlns="http://www.w3.org/2000/svg">
        <path d="${buildGearPath(12)}"
          fill="#EA5C1F" stroke="#EA5C1F" stroke-width="10"
          stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="0" cy="0" r="22" fill="#fff"/>
      </svg>
    `

    markers = []

    for (let i = 0; i < props.points.length; i++) {
      const p = props.points[i]!
      try {
        // На каждую метку — отдельная DivIcon с data-idx, чтобы делегированный
        // hover-listener мог найти соответствующую точку из массива.
        const icon = L.divIcon({
          html: `<div class="sborika-pin" data-idx="${i}">${gearSvg}</div>`,
          className: "sborika-pin-wrap",
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          popupAnchor: [0, -22],
        })

        const marker = L.marker([p.lat, p.lng], { icon }).addTo(mapInstance)

        marker.bindPopup(
          `<div class="sborika-pp">
             <div class="sborika-pp__title">${escapeHtml(p.title)}</div>
             <div class="sborika-pp__addr">${escapeHtml(p.address)}</div>
           </div>`,
          { closeButton: true },
        )

        markers.push(marker)
      } catch (e) {
        console.error("Ошибка при добавлении маркера", p, e)
      }
    }

    markersCount.value = markers.length

    // Делегированные hover-обработчики на самом контейнере карты:
    // ловим mouseover/mouseout, ищем ближайшую .sborika-pin через closest(),
    // считываем индекс точки из data-idx. Этот подход не зависит от
    // момента вставки маркера в DOM и не теряет listener-ы при HMR.
    mapEl.value!.addEventListener("mouseover", onMapMouseOver)
    mapEl.value!.addEventListener("mouseout", onMapMouseOut)

    // Если карту двигают/зумят — пересчитываем позицию активного tooltip.
    mapInstance.on("move zoom", () => {
      if (hovered.value) updateHoveredPos(hovered.value)
    })

    setTimeout(() => mapInstance && mapInstance.invalidateSize(), 100)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    initError.value = `Ошибка инициализации карты: ${msg}`
    console.error(e)
  }
})

onBeforeUnmount(() => {
  if (mapEl.value) {
    mapEl.value.removeEventListener("mouseover", onMapMouseOver)
    mapEl.value.removeEventListener("mouseout", onMapMouseOut)
  }
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
    markers = []
  }
})

/** Делегированный mouseover на контейнере карты — ищем шестерёнку через closest(). */
function onMapMouseOver(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  const pin = target?.closest(".sborika-pin") as HTMLElement | null
  if (!pin) return
  const idx = Number(pin.dataset.idx)
  const p = props.points[idx]
  if (!p) return
  hovered.value = p
  updateHoveredPos(p)
}

/** mouseout: проверяем, что курсор покинул именно метку, а не перешёл на соседний элемент внутри неё. */
function onMapMouseOut(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  const pin = target?.closest(".sborika-pin") as HTMLElement | null
  if (!pin) return
  // relatedTarget — куда ушёл курсор. Если внутри той же метки — ничего не делаем.
  const related = e.relatedTarget as HTMLElement | null
  if (related && pin.contains(related)) return
  hovered.value = null
}

/** Обновить позицию tooltip — переводим географические координаты в пиксельные. */
function updateHoveredPos(p: MapPoint) {
  if (!mapInstance) return
  const point = (mapInstance as any).latLngToContainerPoint([p.lat, p.lng])
  hoveredPos.value = { x: point.x, y: point.y }
}

/** SVG-path шестерёнки с N трапециевидными зубцами — та же геометрия, что в IconGear. */
function buildGearPath(N: number): string {
  const Ro = 50
  const Ri = 38
  const slice = (2 * Math.PI) / N
  const topHalf = slice / 6
  const baseHalf = slice / 5
  const pts: Array<[number, number]> = []
  for (let i = 0; i < N; i++) {
    const c = i * slice - Math.PI / 2
    pts.push([Math.cos(c - topHalf) * Ro, Math.sin(c - topHalf) * Ro])
    pts.push([Math.cos(c + topHalf) * Ro, Math.sin(c + topHalf) * Ro])
    pts.push([Math.cos(c + baseHalf) * Ri, Math.sin(c + baseHalf) * Ri])
    pts.push([Math.cos(c + slice - baseHalf) * Ri, Math.sin(c + slice - baseHalf) * Ri])
  }
  const head = `M ${pts[0]![0].toFixed(2)} ${pts[0]![1].toFixed(2)}`
  const tail = pts
    .slice(1)
    .map(([x, y]) => `L ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")
  return `${head} ${tail} Z`
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
</script>

<template>
  <div class="relative">
    <div
      ref="mapEl"
      class="h-[480px] w-full rounded-2xl overflow-hidden border border-line/60 shadow-sm"
      aria-label="Карта партнёрских центров SBORIKA"
    />

    <!-- Кастомный hover-tooltip. Позиционирование абсолютное относительно
         обёртки .relative; координаты пиксельные, посчитанные через
         mapInstance.latLngToContainerPoint. Стрелочка снизу — псевдоэлемент. -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="hovered && hoveredPos"
        class="pointer-events-none absolute z-[800] -translate-x-1/2 -translate-y-full"
        :style="{
          left: `${hoveredPos.x}px`,
          top: `${hoveredPos.y - 28}px`,
        }"
      >
        <div
          class="relative max-w-[280px] rounded-xl bg-white px-4 py-2.5 shadow-lg border border-line/60"
        >
          <div class="text-sm font-bold text-ink leading-tight">
            {{ hovered.title }}
          </div>
          <div class="mt-1 text-xs text-slate leading-snug">
            {{ hovered.address }}
          </div>
          <!-- Стрелочка вниз, указывающая на метку -->
          <div
            class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[8px] border-t-[8px] border-x-transparent border-t-white"
          />
        </div>
      </div>
    </Transition>

    <!-- Маленький счётчик — отладочный, чтобы быстро видеть, сколько меток
         фактически попало на карту. -->
    <div
      v-if="markersCount > 0 && !initError"
      class="absolute top-3 left-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm border border-line/60 z-[900]"
    >
      Центров на карте: {{ markersCount }} / {{ points.length }}
    </div>

    <!-- Видимое сообщение об ошибке — чтобы не уходить в Console -->
    <div
      v-if="initError"
      class="absolute inset-x-3 top-3 rounded-lg bg-white/95 px-3 py-2 text-sm font-semibold text-brand shadow-sm border border-brand/60 z-[900]"
    >
      {{ initError }}
    </div>
  </div>
</template>

<style>
/* Глобальные стили (без scoped) — Leaflet инжектит DivIcon в свой DOM. */

.sborika-pin-wrap {
  background: transparent !important;
  border: none !important;
}

.sborika-pin {
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
  transition: transform 0.18s ease;
  cursor: pointer;
  transform-origin: center center;
}
.sborika-pin:hover {
  transform: scale(1.25);
}
.sborika-pin svg {
  width: 100%;
  height: 100%;
  display: block;
  /* pointer-events: none — события идут к .sborika-pin (родителю),
     не теряются и не «прыгают» при перемещении внутри SVG. */
  pointer-events: none;
}

/* Брендовая стилизация popup (показывается при клике на метку). */
.leaflet-popup-content-wrapper {
  background: #ffffff !important;
  color: #212431 !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(214, 215, 215, 0.8) !important;
  padding: 4px 6px !important;
}
.leaflet-popup-content {
  margin: 8px 12px !important;
  font-family: "Inter", sans-serif !important;
  line-height: 1.35 !important;
}
.leaflet-popup-tip {
  background: #ffffff !important;
  border: 1px solid rgba(214, 215, 215, 0.8) !important;
}
.sborika-pp__title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
  color: #212431;
}
.sborika-pp__addr {
  color: #4f5d75;
  font-size: 13px;
}
</style>
