import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const FIGMA = 'https://www.figma.com/api/mcp/asset/'
const assets = {
  profile: `${FIGMA}57545a04-56a1-4fcc-aea4-ca31f9045a64`,
  flame: `${FIGMA}fb89f275-c6ac-4a9d-871c-b44c149b7c53`,
  cardArrow: `${FIGMA}c35a68d1-7874-40e9-b8d6-a8e05e36da4c`,
  cardProgress: `${FIGMA}796ecce0-86b5-43b9-acef-20d0981d6285`,
  plus: `${FIGMA}72351386-3dd2-4de7-9067-d885928f82a3`,
  topPlus: `${FIGMA}da770035-6957-4be1-8df5-172ff04567a6`,
  chevron: `${FIGMA}6801f308-1918-46a0-8e68-024fa07ba555`,
  allDay: `${FIGMA}de51b893-329d-4890-8dbe-0b7ddee12e5a`,
  morning: `${FIGMA}e23bc262-3e77-443c-ad99-393fbf56d3d6`,
  afternoon: `${FIGMA}018153b4-b1b5-4057-bf9e-8fd4236abdb3`,
  evening: `${FIGMA}76304e76-49d0-44ad-b9d6-38a56e82f688`,
  home: `${FIGMA}5b6dc204-5221-4288-a3df-5c03ba9fc9db`,
  homeSelected: `${FIGMA}70c7bf7f-2c89-4ff5-bf61-dbbcf0465eed`,
  navNew: `${FIGMA}6b4ba400-e62d-4ffb-adb6-799fc77b26d7`,
  navNewSelected: `${FIGMA}f6373cb3-9483-4fb9-94d0-93f326dda820`,
  progress: `${FIGMA}ed23694a-a5f2-4182-a536-b38e13cf91e6`,
  progressSelected: `${FIGMA}69b3e625-556e-424b-bdc9-e5e82760aff6`,
  more: `${FIGMA}da8c47dc-1f54-4a44-9a6c-879592184380`,
  minus: `${FIGMA}0069a802-93dd-4b2e-b67c-5725c4e295ad`,
  runner: `${FIGMA}0f70454e-c462-4e35-9fa4-1b40cbc895be`,
  back: `${FIGMA}b502798f-b317-427a-a3ab-7039baf41f2b`,
  close: `${FIGMA}53d3c4b9-43ee-41f4-96ed-9cef5041a82d`,
  submit: `${FIGMA}ddd8f214-923b-493b-b465-e303dbea2d19`,
  templateArrow: `${FIGMA}08bc21ea-630e-43c6-b039-5e5460313d96`,
  fitness: `${FIGMA}6976b600-4dfb-415f-b151-43268546dd3f`,
  health: `${FIGMA}d46558af-424f-4c64-a531-350d0c4aaebf`,
  learn: `${FIGMA}6ded1bd1-38af-4973-9577-433fd02f8767`,
  personal: `${FIGMA}8b133f97-ba8b-4071-87e8-a52995ddec5f`,
  finance: `${FIGMA}8ede56e5-b4eb-4267-97fc-fa490a6e01f7`,
  relationships: `${FIGMA}f0574972-dc21-4bb0-93e6-88050e604cac`,
  work: `${FIGMA}6ed46b5b-3a10-4ead-a67b-bccf41868c9b`,
  lifestyle: `${FIGMA}d12602bf-7449-44be-8b63-2d40322b2b25`,
  walk: `${FIGMA}ab4699cb-2e95-47a6-8d55-a1cf3c6c1645`,
  run: `${FIGMA}35cc12b7-99b3-49fc-8e96-3b0521ffce26`,
  bike: `${FIGMA}f3590f6e-a0eb-4843-bc0e-acad9ad94a99`,
  swim: `${FIGMA}3249bf0b-6b75-4717-ae04-6faac2fe0c29`,
  sports: `${FIGMA}6f38d4fb-ef49-4e8d-8842-74a921d6e13e`,
  hike: `${FIGMA}2660a032-0094-4cfc-8824-92e16bc43d23`,
  weights: `${FIGMA}25378aa0-da59-4c3a-802e-559bc2be9467`,
  typeMake: `${FIGMA}ca8a248c-fc86-47dc-ac07-edd3a58a8a9a`,
  typeLimit: `${FIGMA}0a59a22f-460e-4838-906d-672d737d051f`,
  typeBreak: `${FIGMA}3a950559-31cc-401a-b9c1-2dfe4a01349f`,
  timeAllDay: `${FIGMA}a0770333-3649-4f57-a7fb-1280b5ee43e7`,
  timeMorning: `${FIGMA}99be0462-7292-4a0d-ae76-80fc6f4d0435`,
  timeAfternoon: `${FIGMA}7be2159b-9937-4f0d-9b6c-8a012db40911`,
  timeEvening: `${FIGMA}34c1b947-c64a-4a68-908b-da8da0848638`,
  timeAllDaySelected: `${FIGMA}011d505c-c118-429a-89c3-b2e78f9f6593`,
  timeMorningSelected: `${FIGMA}f7f2d942-343a-4d77-8ead-69337641ea4f`,
  timeAfternoonSelected: `${FIGMA}70fdc997-7704-4b29-8508-5d2b95b0129d`,
  timeEveningSelected: `${FIGMA}359c58d8-abfe-41cc-ad14-ec26323cff5f`,
  trendUp: `${FIGMA}2745a07f-6698-46aa-b038-187fbec3295d`,
  laurelLeft: `${FIGMA}a08fd5f5-0a26-47ef-93f1-d19ea5613fce`,
  laurelRight: `${FIGMA}22624705-4df3-4d54-8f96-9e47cba38277`,
  returnToday: `${FIGMA}2f861ebc-4147-4871-90d3-210425d63dab`,
  calendarReturnToday: `${FIGMA}567f3157-d17d-4504-9427-38aa5370a643`,
  statsFlame: `${FIGMA}8c4d08a6-fbda-4151-b709-3ecfb6d6968d`,
  breakdownChevron: `${FIGMA}0f8545d1-d214-403f-ab41-586de78e1981`,
  breakdownTrend: `${FIGMA}a82f1279-31f7-439f-b57f-89ae74f1bd4d`,
  breakdownCompleted: `${FIGMA}b8502a33-147e-4724-a84a-0a7f2177b386`,
  breakdownMissed: `${FIGMA}9bcd84f6-6c8f-4b27-839c-bd7dfae16c6c`,
  breakdownSkipped: `${FIGMA}35d5e837-8eb0-4dde-a5d9-e7237222d86c`,
  breakdownNew: `${FIGMA}67a09ff1-2180-43a4-837f-4684c1b17ad7`,
  menuEdit: `${FIGMA}7ba0151f-f157-4a97-8bc3-7a605e6b59f7`,
  menuSkip: `${FIGMA}e446bd3c-667d-45f6-bd58-23b367b70df1`,
  menuArchive: `${FIGMA}ec810eb3-5090-4202-8194-f47d70f97d27`,
  menuDelete: `${FIGMA}a2385d62-6711-44a0-985d-ee1041740a8c`,
  editBack: `${FIGMA}3a38d37a-8f81-455c-8223-558765eb336e`,
  reminderPlus: `${FIGMA}833c2529-623a-4a67-a808-69beb7d7f754`,
}

const templateAssets = {
  walk: `${FIGMA}43306dd3-8e96-4826-86a6-2829dd589feb`,
  run: `${FIGMA}d9b68e65-fc56-4edf-8ec6-e0033b19499f`,
  bike: `${FIGMA}aae3d2b0-9665-4242-9f47-c7740cb1dd4f`,
  swim: `${FIGMA}ff35529f-3104-4cc4-9f03-0da402ce258d`,
  sports: `${FIGMA}83195121-de52-4300-b650-8157a90e6ace`,
  hike: `${FIGMA}9a74e1ff-0f0a-4fb4-a8f0-a7598847036f`,
  longDistance: `${FIGMA}eef4a5e2-155f-4a4e-a606-e5305b99ba2f`,
  stairs: `${FIGMA}26339095-fc35-432b-9e2d-4b80002a9887`,
  weights: `${FIGMA}82016f5b-d32c-4c67-9d7f-9c21f239e0fc`,
  pushUps: `${FIGMA}01f04ede-f03d-494d-b3b3-c5405b75208d`,
  squats: `${FIGMA}eaf1a18d-625b-4808-a145-3718eaac9d3c`,
  pullUps: `${FIGMA}88e3cd78-c0e1-484b-b285-066da9cd18a2`,
  plank: `${FIGMA}01f04ede-f03d-494d-b3b3-c5405b75208d`,
  lunges: `${FIGMA}28bd486d-3194-47e5-8de5-eec4f4c2bee0`,
  stretch: `${FIGMA}52f21f78-152a-41d1-ab3d-dfad6b0ae75a`,
  yoga: `${FIGMA}78ef60a1-c51c-41b9-94d9-a5fb1b4a7ebf`,
}

type TemplateItem = {
  label: string
  icon: string
  glyph?: 'warm' | 'cool' | 'balance' | 'flexibility'
}

const iconDrawerAssets = [
  `${FIGMA}7ac89798-146c-4fdd-9389-f2dcde5a4b8d`,
  `${FIGMA}5f806ca9-d4ac-4fa8-96f3-68d0ab9ed88f`,
  `${FIGMA}a86d8c21-f1c9-4656-a4c0-a6c44fca561b`,
  `${FIGMA}6b741247-108b-4a40-af32-f76af4b32505`,
  `${FIGMA}8e4a72e1-2af9-4fb6-9a4f-7b2cbedce103`,
  `${FIGMA}72920070-8bb5-4bc9-8ee2-bf6e642ff913`,
  `${FIGMA}c95a9a63-4f76-42de-b24f-52c63ef5ef42`,
  `${FIGMA}347b49d8-d1a9-41d9-b51b-a8369eadf66a`,
  `${FIGMA}5a450e8b-da73-47b7-a77b-9fd5bb5c33eb`,
  `${FIGMA}7d4a0202-61a2-4589-99ac-668113455493`,
  `${FIGMA}35505023-2b6d-477a-93ba-7fdc7254cb1b`,
  `${FIGMA}94712e76-f0df-4201-836f-3e9b2bea8dec`,
  `${FIGMA}b0c2b85e-24e2-477a-bcb5-2b1d3cb8eaaf`,
  `${FIGMA}0a1df412-dbcc-4474-bb59-b1e3ea6ad296`,
  `${FIGMA}bbfd9db0-7470-48c1-9937-1c21f7c2ca91`,
  `${FIGMA}f0dd88ad-aa68-4e02-b160-67fc14485933`,
  `${FIGMA}c7f677a2-f8d7-400a-b79b-9f825d6cca8c`,
  `${FIGMA}42439f9e-17df-4b89-b876-582f1f5c1eba`,
  `${FIGMA}42c7fa5d-04f7-4b52-93d2-55a338bd0526`,
  `${FIGMA}3981e519-52c9-49b0-9a26-8094dbd22b38`,
  `${FIGMA}37f60718-d177-46e3-a121-5d1cf6515ab1`,
  `${FIGMA}6970394b-1f86-4dcc-9f06-d933f12cb99d`,
  `${FIGMA}db9e6f38-70c8-4a9c-ae42-15b5beeeb871`,
  `${FIGMA}26b721bb-c85f-4a93-ae14-4fbcf040ea2c`,
  `${FIGMA}1907a059-2ff4-489d-8bc1-cb11c00606ac`,
  `${FIGMA}6cbd034e-09aa-4937-ab62-3ba8cb27c36c`,
  `${FIGMA}224a052a-8ac3-4919-977f-d4bedb372d4b`,
]

type AppTab = 'Home' | 'New' | 'Progress'
type TimeKey = 'All Day' | 'Morning' | 'Afternoon' | 'Evening'
type Overlay = 'habit' | 'calendar' | 'menu' | 'edit' | null
type HabitType = 'Make' | 'Limit' | 'Break'
type NewStep = 'landing' | 'templates' | 'details' | 'goal' | 'review'
type NewPopup = 'icons' | 'colors' | 'types' | 'units' | null
type Frequency = 'Daily' | 'Weekly' | 'Monthly'

type Habit = {
  id: string
  name: string
  color: string
  icon: string
  type: HabitType
  quantity: number
  unit: string
  frequency: Frequency
  activeDays: string[]
  timeOfDay: TimeKey
  streak: number
}

type DraftHabit = Omit<Habit, 'timeOfDay'> & {
  timeOfDay: TimeKey | ''
}

type MonthBreakdownStats = {
  completed: number
  missed: number
  skipped: number
  newHabits?: number
  completionRate: number
  trend: number
}

type HabitCompletionStat = {
  activeDays: number
  completedDays: number
  missedDays: number
  skippedDays: number
  completionRate: number
  trend: number
  todayRatio: number
}

const times: { label: TimeKey; icon: string }[] = [
  { label: 'All Day', icon: assets.allDay },
  { label: 'Morning', icon: assets.morning },
  { label: 'Afternoon', icon: assets.afternoon },
  { label: 'Evening', icon: assets.evening },
]

const createTimes: { label: TimeKey; icon: string; selectedIcon: string }[] = [
  { label: 'All Day', icon: assets.timeAllDay, selectedIcon: assets.timeAllDaySelected },
  { label: 'Morning', icon: assets.timeMorning, selectedIcon: assets.timeMorningSelected },
  { label: 'Afternoon', icon: assets.timeAfternoon, selectedIcon: assets.timeAfternoonSelected },
  { label: 'Evening', icon: assets.timeEvening, selectedIcon: assets.timeEveningSelected },
]

const week = ['Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We']
const createDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const createDayKeys = createDays.map((day, index) => `${day}-${index}`)
const calendarToday = 10
const todayWeekKey = 'We'
const defaultCurrentStreak = 3
const defaultBestStreak = 13
const colors = ['#4fb9f3', '#63e578', '#f17eda', '#efb74f', '#ec6a6a', '#c165eb', '#be1b1b', '#3e960e', '#9e0974', '#cc6a14', '#005d8f']
const units = ['Done', 'Times', 'Miles', 'Pages', 'Minutes', 'Hours', 'Cups', 'Custom']
const calendarColors = ['#006297', '#37a398', '#97da90', '#e4e7d2']
const mayCalendar = [
  ['', '', '', '', '', 'blue', 'teal'],
  ['blue', 'blue', 'blue', 'green', 'pale', 'green', 'blue'],
  ['pale', 'pale', 'green', 'blue', 'pale', 'pale', 'green'],
  ['green', 'pale', 'teal', 'teal', 'pale', 'teal', 'teal'],
  ['teal', 'green', 'green', 'blue', 'blue', 'blue', 'blue'],
  ['blue', '', '', '', '', '', ''],
]
const juneCalendar = [
  ['', 'blue', 'blue', 'teal', 'green', 'blue', 'blue'],
  ['pale', 'green', 'teal', 'blue', 'pale', 'pale', 'pale'],
  ['teal', 'blue', 'blue', 'teal', 'pale', 'teal', 'green'],
  ['pale', 'pale', 'green', 'blue', 'green', 'teal', 'blue'],
  ['green', 'blue', 'pale', '', '', '', ''],
]
const calendarPalette: Record<string, string> = {
  blue: calendarColors[0],
  teal: calendarColors[1],
  green: calendarColors[2],
  pale: calendarColors[3],
}
const calendarDotPattern = ['teal', 'teal', 'blue', 'green', 'green', 'teal', 'pale', 'blue', 'green', 'teal', 'teal', 'blue', 'blue', 'green', 'teal', 'teal', 'pale', 'pale', 'green', 'pale', 'teal', 'pale', 'blue', 'blue', 'green', 'green', 'blue', 'pale', 'teal', 'blue', 'green']
const getCalendarDayKey = (day: number) => (day === calendarToday ? todayWeekKey : `June-${day}`)
const seededProgressByTone: Record<string, number> = {
  pale: 0,
  green: 1,
  teal: 3,
  blue: 4,
}
const getCalendarToneForProgress = (value: number, max: number) => {
  const ratio = max > 0 ? value / max : 0
  if (ratio >= 1) return 'blue'
  if (ratio >= 0.5) return 'teal'
  if (ratio > 0) return 'green'
  return 'pale'
}

const categories = [
  { label: 'Fitness', icon: assets.fitness },
  { label: 'Health', icon: assets.health },
  { label: 'Learn', icon: assets.learn },
  { label: 'Personal', icon: assets.personal },
  { label: 'Finance', icon: assets.finance },
  { label: 'Relationships', icon: assets.relationships },
  { label: 'Work', icon: assets.work },
  { label: 'Lifestyle', icon: assets.lifestyle },
]

const templates: { group: string; items: TemplateItem[] }[] = [
  { group: 'Cardio', items: [
    { label: 'Walk', icon: templateAssets.walk },
    { label: 'Run', icon: templateAssets.run },
    { label: 'Bike', icon: templateAssets.bike },
    { label: 'Swim', icon: templateAssets.swim },
    { label: 'Sports', icon: templateAssets.sports },
    { label: 'Hike', icon: templateAssets.hike },
    { label: 'Long Distance', icon: templateAssets.longDistance },
    { label: 'Stairs', icon: templateAssets.stairs },
  ] },
  { group: 'Strength', items: [
    { label: 'Lift Weights', icon: templateAssets.weights },
    { label: 'Push ups', icon: templateAssets.pushUps },
    { label: 'Squats', icon: templateAssets.squats },
    { label: 'Pull Ups', icon: templateAssets.pullUps },
    { label: 'Plank', icon: templateAssets.plank },
    { label: 'Lunges', icon: templateAssets.lunges },
  ] },
  { group: 'Mobility', items: [
    { label: 'Stretch', icon: templateAssets.stretch },
    { label: 'Yoga', icon: templateAssets.yoga },
    { label: 'Warm up', icon: templateAssets.stretch, glyph: 'warm' },
    { label: 'Cool downs', icon: templateAssets.yoga, glyph: 'cool' },
    { label: 'Balance', icon: templateAssets.yoga, glyph: 'balance' },
    { label: 'Flexibility', icon: templateAssets.stretch, glyph: 'flexibility' },
  ] },
]

const seededHabit: Habit = {
  id: 'seed-running',
  name: 'Go Running',
  color: '#005d8f',
  icon: assets.run,
  type: 'Make',
  quantity: 4,
  unit: 'Miles',
  frequency: 'Daily',
  activeDays: createDayKeys,
  timeOfDay: 'All Day',
  streak: 12,
}

const createDraft = (
  name = 'Go Running',
  icon = assets.run,
  timeOfDay: TimeKey | '' = '',
  prefillGoal = false,
): DraftHabit => ({
  id: `habit-${Date.now()}`,
  name,
  color: '#005d8f',
  icon,
  type: 'Make',
  quantity: prefillGoal ? 4 : 0,
  unit: prefillGoal ? 'Miles' : '',
  frequency: 'Daily',
  activeDays: createDayKeys,
  timeOfDay,
  streak: 0,
})

function IconButton({
  className = '',
  icon,
  label,
  onClick,
}: {
  className?: string
  icon: string
  label: string
  onClick?: () => void
}) {
  return (
    <button className={`icon-button ${className}`} type="button" aria-label={label} onClick={onClick}>
      <img src={icon} alt="" />
    </button>
  )
}

function TopBar({ dateLabel, onCalendar }: { dateLabel: string; onCalendar: () => void }) {
  return (
    <header className="top">
      <div className="top-row">
        <button className="today-button" type="button" onClick={onCalendar}>
          <span>{dateLabel}</span>
          <img src={assets.chevron} alt="" />
        </button>
        <IconButton className="top-plus" icon={assets.topPlus} label="New habit" />
        <IconButton icon={assets.profile} label="Profile" />
      </div>
    </header>
  )
}

function TimeSelector({
  selected,
  onSelect,
}: {
  selected: TimeKey
  onSelect: (time: TimeKey) => void
}) {
  return (
    <nav className="time-selector" aria-label="Time of day">
      {times.map((time) => (
        <button
          className={`time-option ${selected === time.label ? 'selected' : ''}`}
          key={time.label}
          type="button"
          onClick={() => onSelect(time.label)}
        >
          <img src={time.icon} alt="" />
          {selected === time.label && <span>{time.label}</span>}
        </button>
      ))}
    </nav>
  )
}

function HabitCardProgress({ icon, value, max }: { icon: string; value: number; max: number }) {
  const radius = 25
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, max > 0 ? value / max : 0))
  const dash = circumference * 0.73
  const gap = circumference - dash

  return (
    <div className="habit-progress-small">
      <svg viewBox="0 0 64 56" aria-hidden="true">
        <circle className="small-arc-track" cx="32" cy="28" r={radius} strokeDasharray={`${dash} ${gap}`} />
        {progress > 0 && (
          <circle
            className="small-arc-fill"
            cx="32"
            cy="28"
            r={radius}
            strokeDasharray={`${dash * progress} ${circumference}`}
          />
        )}
      </svg>
      <img src={icon} alt="" />
    </div>
  )
}

function HabitCard({
  habit,
  value,
  onOpen,
  onIncrement,
}: {
  habit: Habit
  value: number
  onOpen: () => void
  onIncrement: () => void
}) {
  const completeToday = value >= habit.quantity

  return (
    <div className="habit-card">
      <button className="habit-card-main" type="button" onClick={onOpen}>
        <HabitCardProgress icon={habit.icon} value={value} max={habit.quantity} />
        <div className="habit-copy">
          <strong>{habit.name}</strong>
          <span>{value} of {habit.quantity} {habit.unit}</span>
        </div>
      </button>
      {completeToday && (
        <div className="streak">
          <img src={assets.flame} alt="" />
          <span>1</span>
        </div>
      )}
      <button className="card-arrow" type="button" aria-label={`Increase ${habit.name}`} onClick={onIncrement}>
        <img src={assets.cardArrow} alt="" />
      </button>
    </div>
  )
}

function EmptyHome({ onNew }: { onNew: () => void }) {
  return (
    <main className="empty-home">
      <div className="welcome">
        <span>Welcome</span>
        <span>Time to make your first habit</span>
      </div>
      <button className="habit-card empty-card" type="button" onClick={onNew}>
        <img className="habit-progress-small" src={assets.cardProgress} alt="" />
        <div className="habit-copy">
          <strong>Make a new habit</strong>
          <span>0 of 1</span>
        </div>
        <span className="card-arrow">
          <img src={assets.cardArrow} alt="" />
        </span>
      </button>
    </main>
  )
}

function BottomNav({
  active,
  onNavigate,
}: {
  active: AppTab
  onNavigate: (tab: AppTab) => void
}) {
  return (
    <nav className="bottom-nav" aria-label="App navigation">
      <button className={active === 'Home' ? 'active' : ''} type="button" onClick={() => onNavigate('Home')}>
        <img src={active === 'Home' ? assets.homeSelected : assets.home} alt="" />
        <span>Home</span>
      </button>
      <button className={active === 'New' ? 'active' : ''} type="button" onClick={() => onNavigate('New')}>
        <img src={active === 'New' ? assets.navNewSelected : assets.navNew} alt="" />
        <span>New</span>
      </button>
      <button className={active === 'Progress' ? 'active' : ''} type="button" onClick={() => onNavigate('Progress')}>
        <img src={active === 'Progress' ? assets.progressSelected : assets.progress} alt="" />
        <span>Progress</span>
      </button>
    </nav>
  )
}

function CalendarOverlay({
  selectedDay,
  onSelectDay,
  onReturn,
  onClose,
  getDayTone,
}: {
  selectedDay: number
  onSelectDay: (day: number) => void
  onReturn: () => void
  onClose: () => void
  getDayTone: (day: number) => string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const selectedLabel = selectedDay === calendarToday ? 'Today' : `June ${formatOrdinal(selectedDay)}`

  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }, [])

  return (
    <section className={`calendar-drop ${selectedDay !== calendarToday ? 'has-return' : ''}`}>
      <div className="calendar-top">
        <button className="calendar-date-button" type="button" onClick={onClose}>
          <span>{selectedLabel}</span>
          <img src={assets.chevron} alt="" />
        </button>
        <IconButton icon={assets.close} label="Close calendar" onClick={onClose} />
      </div>
      <div className="calendar-grabber"></div>
      <div className="calendar-scroll" ref={scrollerRef}>
        <div className="calendar-month-stack">
          <CalendarMonth name="March" days={31} startOffset={0} />
          <CalendarMonth name="April" days={30} startOffset={3} />
          <CalendarMonth name="May" days={31} startOffset={5} />
          <CalendarMonth
            name="June"
            days={30}
            startOffset={1}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
            getDayTone={getDayTone}
          />
        </div>
      </div>
      {selectedDay !== calendarToday && (
        <button className="return-button calendar-return" type="button" onClick={onReturn}>
          <img src={assets.calendarReturnToday} alt="" />
          <span>Return to today</span>
        </button>
      )}
    </section>
  )
}

function CalendarMonth({
  name,
  days,
  startOffset,
  selectedDay,
  onSelectDay,
  getDayTone,
}: {
  name: string
  days: number
  startOffset: number
  selectedDay?: number
  onSelectDay?: (day: number) => void
  getDayTone?: (day: number) => string
}) {
  const isCurrentMonth = name === 'June'
  const cells: { key: string; day?: number }[] = [
    ...Array.from({ length: startOffset }, (_, index) => ({ key: `blank-${index}` })),
    ...Array.from({ length: days }, (_, index) => ({ key: `${name}-${index + 1}`, day: index + 1 })),
  ]

  return (
    <section className="calendar-month">
      <h2>{name}</h2>
      <div className="weekday-row">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="month-grid">
        {cells.map((cell) => {
          const isFutureDay = isCurrentMonth && Boolean(cell.day && cell.day > calendarToday)
          const tone = cell.day && isCurrentMonth
            ? getDayTone?.(cell.day) ?? calendarDotPattern[(cell.day - 1) % calendarDotPattern.length]
            : cell.day
              ? calendarDotPattern[(cell.day - 1) % calendarDotPattern.length]
              : 'pale'

          return cell.day ? (
            <button
              className={`${cell.day === selectedDay ? 'picked' : ''} ${isCurrentMonth && cell.day === calendarToday ? 'today' : ''} ${isFutureDay ? 'future' : ''}`}
              disabled={isFutureDay}
              key={cell.key}
              type="button"
              onClick={() => {
                if (isCurrentMonth && cell.day && !isFutureDay) onSelectDay?.(cell.day)
              }}
            >
              <span>{cell.day}</span>
              {!isFutureDay && <i style={{ background: calendarPalette[tone] }}></i>}
            </button>
          ) : (
            <span className="calendar-empty-cell" key={cell.key}></span>
          )
        })}
      </div>
    </section>
  )
}

function formatOrdinal(day: number) {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`
  if (day % 10 === 1) return `${day}st`
  if (day % 10 === 2) return `${day}nd`
  if (day % 10 === 3) return `${day}rd`
  return `${day}th`
}

function formatDays(days: number) {
  return `${days} ${days === 1 ? 'Day' : 'Days'}`
}

function getProgressRatio(value: number, max: number) {
  return Math.max(0, Math.min(1, max > 0 ? value / max : 0))
}

function getCalendarTone(ratio: number) {
  if (ratio >= 1) return 'blue'
  if (ratio >= 0.67) return 'teal'
  if (ratio > 0) return 'green'
  return 'pale'
}

function ProgressArc({ icon, value, max }: { icon: string; value: number; max: number }) {
  const radius = 82
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, value / max))
  const dash = circumference * 0.73
  const gap = circumference - dash

  return (
    <div className="progress-arc">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle className="arc-track" cx="100" cy="100" r={radius} strokeDasharray={`${dash} ${gap}`} />
        {progress > 0 && (
          <circle
            className="arc-fill"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={`${dash * progress} ${circumference}`}
          />
        )}
      </svg>
      <img className="progress-habit-icon" src={icon} alt="" />
    </div>
  )
}

function DayProgressButton({
  day,
  selected,
  value,
  max,
  onClick,
}: {
  day: string
  selected: boolean
  value: number
  max: number
  onClick: () => void
}) {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, max > 0 ? value / max : 0))
  const dash = circumference * 0.73
  const gap = circumference - dash

  return (
    <button className={selected ? 'selected' : ''} type="button" onMouseDown={(event) => event.preventDefault()} onClick={onClick}>
      <svg className="day-arc" viewBox="0 0 40 40" aria-hidden="true">
        <circle
          className="day-arc-track"
          cx="20"
          cy="20"
          r={radius}
          strokeDasharray={`${dash} ${gap}`}
        />
        {progress > 0 && (
          <circle
            className="day-arc-fill"
            cx="20"
            cy="20"
            r={radius}
            strokeDasharray={`${dash * progress} ${circumference}`}
          />
        )}
      </svg>
      <span>{day}</span>
    </button>
  )
}

function StreakSummary({
  current,
  best = defaultBestStreak,
  empty = false,
}: {
  current: number
  best?: number
  empty?: boolean
}) {
  return (
    <div className={`streak-summary ${empty ? 'empty' : ''}`}>
      <img className="laurel laurel-left" src={assets.laurelLeft} alt="" />
      <div className="current-streak">
        <span>
          {!empty && <img src={assets.statsFlame} alt="" />}
          <b>{formatDays(current)}</b>
        </span>
        <em>Current Streak</em>
      </div>
      <div className="best-streak">
        <b>{formatDays(best)}</b>
        <em>Best Streak</em>
      </div>
      <img className="laurel laurel-right" src={assets.laurelRight} alt="" />
    </div>
  )
}

function MonthlyStats({ streak }: { streak: number }) {
  return (
    <section className="monthly-stats-card">
      <div className="completion-summary">
        <div className="completion-head">
          <strong>Monthly Completion Rate</strong>
          <div className="completion-numbers">
            <span className="trend">
              <img src={assets.trendUp} alt="" />
              4%
            </span>
            <b>90%</b>
          </div>
        </div>
        <div className="completion-bar" aria-hidden="true">
          <span></span>
        </div>
      </div>
      <StreakSummary current={Math.min(3, streak)} />
    </section>
  )
}

function MonthCard({ name, rows }: { name: string; rows: string[][] }) {
  return (
    <section className="month-card">
      <strong>{name}</strong>
      <div className="month-weekdays" aria-hidden="true">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="month-blocks" aria-hidden="true">
        {rows.map((row, rowIndex) => (
          <div className="month-row" key={`${name}-${rowIndex}`}>
            {row.map((color, columnIndex) => (
              <i
                key={`${name}-${rowIndex}-${columnIndex}`}
                style={{ background: color ? calendarPalette[color] : 'transparent' }}
              ></i>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function tintCalendarRows(rows: string[][], todayRatio?: number) {
  if (typeof todayRatio !== 'number') return rows
  let seenDays = 0
  const todayTone = getCalendarTone(todayRatio)

  return rows.map((row) => row.map((tone) => {
    if (!tone) return ''
    seenDays += 1
    if (seenDays === calendarToday) return todayTone
    return 'pale'
  }))
}

function CalendarHistory({ todayRatio }: { todayRatio?: number }) {
  const mayRows = typeof todayRatio === 'number' ? tintCalendarRows(mayCalendar, 0) : mayCalendar
  const juneRows = tintCalendarRows(juneCalendar, todayRatio)

  return (
    <section className="calendar-history">
      <div className="calendar-months">
        <MonthCard name="May" rows={mayRows} />
        <MonthCard name="June" rows={juneRows} />
      </div>
      <div className="calendar-history-foot">
        <button type="button">See All</button>
        <div className="calendar-legend" aria-label="Completion legend">
          <span><i></i> Less</span>
          <span><i></i> More</span>
        </div>
      </div>
    </section>
  )
}

function MonthBreakdown({
  stats,
  includeNew = true,
}: {
  stats: MonthBreakdownStats
  includeNew?: boolean
}) {
  const rate = Math.max(0, Math.min(100, stats.completionRate))
  const gaugePath = 'M 10 120 C 10 51 62 10 120 10 C 178 10 230 51 230 120'
  const items = [
    { label: 'Completed', value: stats.completed, icon: assets.breakdownCompleted },
    { label: 'Missed', value: stats.missed, icon: assets.breakdownMissed },
    { label: 'Skipped', value: stats.skipped, icon: assets.breakdownSkipped },
    ...(includeNew ? [{ label: 'New', value: stats.newHabits ?? 0, icon: assets.breakdownNew }] : []),
  ]

  return (
    <section className="month-breakdown">
      <div className="progress-section-head">
        <h2>Month Breakdown</h2>
        <button className="month-picker" type="button">
          <span>June</span>
          <img src={assets.breakdownChevron} alt="" />
        </button>
      </div>
      <div className="breakdown-card">
        <div className="breakdown-ring">
          <svg viewBox="0 0 240 240" aria-hidden="true">
            <path className="breakdown-ring-track" d={gaugePath} />
            {rate > 0 && (
              <path
                className="breakdown-ring-fill"
                d={gaugePath}
                pathLength={100}
                style={{ strokeDasharray: 100, strokeDashoffset: 100 - rate }}
              />
            )}
          </svg>
          <div className="breakdown-rate">
            <b>{rate}%</b>
            <span>Completion Rate</span>
            <em>
              <img src={assets.breakdownTrend} alt="" />
              {stats.trend}% From May
            </em>
          </div>
        </div>
        <div className={`breakdown-grid ${includeNew ? '' : 'three-items'}`}>
          {items.map((item) => (
            <div className="breakdown-stat" key={item.label}>
              <span>
                <img src={item.icon} alt="" />
                {item.label}
              </span>
              <strong>{item.value}<small>Habits</small></strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HabitCompletionRow({
  habit,
  stat,
  onOpen,
}: {
  habit: Habit
  stat: HabitCompletionStat
  onOpen: () => void
}) {
  return (
    <button className="habit-completion-row" type="button" onClick={onOpen}>
      <div className="habit-completion-top">
        <span className="habit-completion-name">
          <img src={habit.icon} alt="" />
          {habit.name}
        </span>
        <span className="habit-completion-score">
          {stat.trend > 0 && (
            <em>
              <img src={assets.trendUp} alt="" />
              {stat.trend}%
            </em>
          )}
          <b>{stat.completionRate}%</b>
        </span>
      </div>
      <span className="habit-completion-track">
        <i style={{ width: `${stat.completionRate}%` }}></i>
      </span>
    </button>
  )
}

function ProgressMain({
  habits,
  statsByHabit,
  monthStats,
  currentStreak,
  onHabit,
}: {
  habits: Habit[]
  statsByHabit: Record<string, HabitCompletionStat>
  monthStats: MonthBreakdownStats
  currentStreak: number
  onHabit: (id: string) => void
}) {
  return (
    <main className="progress-screen">
      <header className="progress-topbar">
        <h1>Progress</h1>
        <IconButton icon={assets.profile} label="Profile" />
      </header>
      <div className="progress-content">
        <StreakSummary current={currentStreak} />
        <CalendarHistory />
        <MonthBreakdown stats={monthStats} />
        <section className="habit-completion">
          <div className="habit-completion-head">
            <h2>Individual Habit Completion</h2>
            <button type="button">
              <span>Best</span>
              <img src={assets.breakdownChevron} alt="" />
            </button>
          </div>
          <div className="habit-completion-list">
            {habits.map((habit) => (
              <HabitCompletionRow
                habit={habit}
                key={habit.id}
                stat={statsByHabit[habit.id]}
                onOpen={() => onHabit(habit.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function ProgressHabitDetail({
  habit,
  stat,
  onBack,
}: {
  habit: Habit
  stat: HabitCompletionStat
  onBack: () => void
}) {
  const hasStarted = stat.completedDays > 0

  return (
    <main className="progress-screen progress-detail-screen">
      <header className="progress-detail-topbar">
        <IconButton icon={assets.editBack} label="Back to progress" onClick={onBack} />
        <div>
          <h1>{habit.name}</h1>
          <span>Progress</span>
        </div>
      </header>
      <div className="progress-content progress-detail-content">
        <StreakSummary current={hasStarted ? stat.completedDays : 0} best={hasStarted ? stat.completedDays : 0} empty={!hasStarted} />
        <CalendarHistory todayRatio={stat.todayRatio} />
        <MonthBreakdown
          includeNew={false}
          stats={{
            completed: stat.completedDays,
            missed: stat.missedDays,
            skipped: stat.skippedDays,
            completionRate: stat.completionRate,
            trend: stat.trend,
          }}
        />
      </div>
    </main>
  )
}

function HabitOverlay({
  habit,
  day,
  value,
  progressByDay,
  onDay,
  onValue,
  onMenu,
  onReturnToday,
}: {
  habit: Habit
  day: string
  value: number
  progressByDay: Record<string, number>
  onDay: (day: string) => void
  onValue: (value: number) => void
  onMenu: () => void
  onReturnToday: () => void
}) {
  const numericValue = Number.isFinite(value) ? value : 0
  const selectDay = (nextDay: string) => {
    onDay(nextDay)
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.habit-sheet')?.scrollTo({ top: 0 })
    })
  }

  return (
    <>
      <div className="sheet-grabber" aria-hidden="true"></div>
      <section className="habit-sheet">
        <div className="sheet-header">
          <div className="sheet-title">
            <strong>{habit.name}</strong>
            <span>{habit.frequency} <b>-</b> {habit.timeOfDay}</span>
          </div>
          <IconButton icon={assets.more} label="More options" onClick={onMenu} />
        </div>

        <div className="value-stage">
          <IconButton
            icon={assets.minus}
            label="Decrease progress"
            onClick={() => onValue(Math.max(0, numericValue - 1))}
          />
          <div className="value-control">
            <ProgressArc icon={habit.icon} value={numericValue} max={habit.quantity} />
            <label>
              <input
                inputMode="numeric"
                max={habit.quantity}
                min={0}
                type="number"
                value={numericValue}
                onChange={(event) => onValue(Math.max(0, Math.min(habit.quantity, Number(event.target.value))))}
              />
              <span>of {habit.quantity} {habit.unit.toLowerCase()}</span>
            </label>
          </div>
          <IconButton
            icon={assets.plus}
            label="Increase progress"
            onClick={() => onValue(Math.min(habit.quantity, numericValue + 1))}
          />
        </div>

        <div className="week-pills">
          {week.map((weekDay) => (
            <DayProgressButton
              day={weekDay}
              key={weekDay}
              max={habit.quantity}
              selected={weekDay === day}
              value={progressByDay[weekDay] ?? 0}
              onClick={() => selectDay(weekDay)}
            />
          ))}
        </div>

        {day !== 'We' && (
          <button className="return-today-row" type="button" onClick={onReturnToday}>
            <img src={assets.returnToday} alt="" />
            <span>Return to today</span>
          </button>
        )}

        <MonthlyStats streak={habit.streak} />
        <CalendarHistory />
      </section>
    </>
  )
}

function HabitMenu({
  onEdit,
  onSkip,
  onArchive,
  onDelete,
}: {
  onEdit: () => void
  onSkip: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const menuItems = [
    { label: 'Edit Habit', icon: assets.menuEdit, onClick: onEdit },
    { label: 'Skip Today', icon: assets.menuSkip, onClick: onSkip },
    { label: 'Archive Habit', icon: assets.menuArchive, onClick: onArchive },
    { label: 'Delete Habit', icon: assets.menuDelete, onClick: onDelete, danger: true },
  ]

  return (
    <div className="menu-popover">
      {menuItems.map((item) => (
        <button className={item.danger ? 'danger' : ''} key={item.label} type="button" onClick={item.onClick}>
          <img src={item.icon} alt="" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

function EditHabit({
  habit,
  onBack,
  onSave,
  onDelete,
}: {
  habit: Habit
  onBack: () => void
  onSave: (habit: Habit) => void
  onDelete: () => void
}) {
  const [draft, setDraft] = useState<Habit>(habit)
  const [popup, setPopup] = useState<NewPopup | 'frequency'>('frequency')
  const patchDraft = (patch: Partial<Habit>) => setDraft((previous) => ({ ...previous, ...patch }))

  return (
    <section className="new-screen edit-habit-screen">
      <div className="edit-flow-nav">
        <IconButton icon={assets.editBack} label="Back" onClick={onBack} />
        <strong>Edit Habit</strong>
        <button className="edit-save-button" type="button" onClick={() => onSave(draft)}>Save</button>
      </div>

      <div className="review-content edit-content">
        <section className="field-group">
          <p>Details</p>
          <label className="detail-field text-input edit-name-input">
            <input value={draft.name} onChange={(event) => patchDraft({ name: event.target.value })} />
          </label>
          <div className="field-pair">
            <DetailRow label="Icon" icon={draft.icon} iconTone="gradient" onClick={() => setPopup('icons')} />
            <DetailRow label="Color" color={draft.color} onClick={() => setPopup('colors')} />
          </div>
        </section>

        <section className="field-group">
          <p>Type</p>
          <TypeField
            type={draft.type}
            expanded={popup === 'types'}
            onToggle={() => setPopup(popup === 'types' ? null : 'types')}
            onSelect={(type) => {
              patchDraft({ type })
              setPopup(null)
            }}
          />
        </section>

        <section className="field-group">
          <p>Goal</p>
          <div className="field-pair">
            <label className="detail-field text-input">
              <input
                inputMode="numeric"
                min={1}
                type="number"
                value={draft.quantity}
                onChange={(event) => patchDraft({ quantity: event.target.value ? Math.max(1, Number(event.target.value)) : 1 })}
              />
            </label>
            <DetailRow label={draft.unit} chevron onClick={() => setPopup('units')} />
          </div>
          <FrequencyField
            frequency={draft.frequency}
            activeDays={draft.activeDays}
            expanded={popup === 'frequency'}
            onToggle={() => setPopup(popup === 'frequency' ? null : 'frequency')}
            onFrequency={(frequency) => patchDraft({ frequency })}
            onDays={(activeDays) => patchDraft({ activeDays })}
          />
        </section>

        <section className="field-group">
          <p>Time of day</p>
          <div className="create-time-box">
            {createTimes.map((item) => (
              <button
                className={draft.timeOfDay === item.label ? 'selected' : ''}
                key={item.label}
                type="button"
                onClick={() => patchDraft({ timeOfDay: item.label })}
              >
                <img src={draft.timeOfDay === item.label ? item.selectedIcon : item.icon} alt="" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="field-group">
          <p>Reminders</p>
          <DetailRow label="Create custom reminder" icon={assets.reminderPlus} muted />
        </section>

        <div className="field-pair date-pair">
          <section className="field-group">
            <p>Start Date</p>
            <DetailRow label="Today" chevron />
          </section>
          <section className="field-group">
            <p>End Date</p>
            <DetailRow label="Never" chevron />
          </section>
        </div>

        <button className="edit-delete-button" type="button" onClick={onDelete}>Delete Habit</button>
      </div>

      {(popup === 'icons' || popup === 'units') && <button className="drawer-backdrop" type="button" aria-label="Close popup" onClick={() => setPopup(null)} />}
      {popup === 'icons' && <IconDrawer onClose={() => setPopup(null)} onSelect={(icon) => { patchDraft({ icon }); setPopup(null) }} />}
      {popup === 'colors' && <ColorPicker color={draft.color} onClose={() => setPopup(null)} onSelect={(color) => { patchDraft({ color }); setPopup(null) }} />}
      {popup === 'units' && <UnitDrawer onSelect={(unit) => { patchDraft({ unit }); setPopup(null) }} />}
    </section>
  )
}

function FlowNav({
  progress,
  title,
  onBack,
  onExit,
}: {
  progress?: number
  title?: string
  onBack?: () => void
  onExit: () => void
}) {
  return (
    <>
      {title && <p className="flow-titlebar">{title}</p>}
      <div className="flow-nav">
        {onBack ? (
          <IconButton icon={assets.back} label="Back" onClick={onBack} />
        ) : (
          <span className="flow-nav-spacer"></span>
        )}
        <IconButton icon={assets.close} label="Close" onClick={onExit} />
      </div>
      {typeof progress === 'number' && (
        <div className="flow-progress">
          <span style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}></span>
        </div>
      )}
    </>
  )
}

function TemplateGlyphIcon({ glyph }: { glyph: NonNullable<TemplateItem['glyph']> }) {
  const gradientId = `template-gradient-${glyph}`

  return (
    <svg className="template-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#426fff" />
          <stop offset="1" stopColor="#24c7ef" />
        </linearGradient>
      </defs>
      {glyph === 'warm' && (
        <>
          <path stroke={`url(#${gradientId})`} d="M5 15c2-3 4-4 7-4s5 1 7 4" />
          <path stroke={`url(#${gradientId})`} d="M8 18h8" />
          <path stroke={`url(#${gradientId})`} d="M8 7l2 2m6-2-2 2M12 4v3" />
        </>
      )}
      {glyph === 'cool' && (
        <>
          <path stroke={`url(#${gradientId})`} d="M6 7c2 2 4 2 6 0s4-2 6 0" />
          <path stroke={`url(#${gradientId})`} d="M6 12c2 2 4 2 6 0s4-2 6 0" />
          <path stroke={`url(#${gradientId})`} d="M6 17c2 2 4 2 6 0s4-2 6 0" />
        </>
      )}
      {glyph === 'balance' && (
        <>
          <path stroke={`url(#${gradientId})`} d="M12 5v14" />
          <path stroke={`url(#${gradientId})`} d="M7 9h10" />
          <path stroke={`url(#${gradientId})`} d="M7 9l-3 5h6L7 9Z" />
          <path stroke={`url(#${gradientId})`} d="M17 9l-3 5h6l-3-5Z" />
          <path stroke={`url(#${gradientId})`} d="M9 19h6" />
        </>
      )}
      {glyph === 'flexibility' && (
        <>
          <path stroke={`url(#${gradientId})`} d="M5 17c3-6 6-9 10-9" />
          <path stroke={`url(#${gradientId})`} d="M14 8l5 2" />
          <path stroke={`url(#${gradientId})`} d="M11 12l6 5" />
          <path stroke={`url(#${gradientId})`} d="M5 17h7" />
        </>
      )}
    </svg>
  )
}

function TemplateButton({
  label,
  icon,
  glyph,
  onClick,
}: {
  label: string
  icon: string
  glyph?: TemplateItem['glyph']
  onClick: () => void
}) {
  return (
    <button className="template-button" type="button" onClick={onClick}>
      <span className="template-icon">
        {glyph ? <TemplateGlyphIcon glyph={glyph} /> : <img src={icon} alt="" />}
      </span>
      <span className="template-label">{label}</span>
      <img className="template-arrow" src={assets.templateArrow} alt="" />
    </button>
  )
}

function NewLanding({
  draftName,
  onName,
  onCustom,
  onCategory,
}: {
  draftName: string
  onName: (name: string) => void
  onCustom: () => void
  onCategory: () => void
}) {
  const submitCustom = (event: FormEvent) => {
    event.preventDefault()
    if (draftName.trim()) onCustom()
  }

  return (
    <section className="new-screen">
      <form className="new-name-area" onSubmit={submitCustom}>
        <h1>What should we call your new habit?</h1>
        <label className="new-name-field">
          <input
            placeholder="Habit name"
            value={draftName}
            onChange={(event) => onName(event.target.value)}
          />
          {draftName.trim() && (
            <button type="submit" aria-label="Continue">
              <img src={assets.submit} alt="" />
            </button>
          )}
        </label>
      </form>
      <section className="template-section">
        <p>Templates</p>
        <div className="template-grid">
          {categories.map((category) => (
            <TemplateButton key={category.label} label={category.label} icon={category.icon} onClick={onCategory} />
          ))}
        </div>
      </section>
    </section>
  )
}

function TemplateList({
  onBack,
  onExit,
  onSelect,
}: {
  onBack: () => void
  onExit: () => void
  onSelect: (name: string, icon: string) => void
}) {
  return (
    <section className="new-screen">
      <FlowNav title="Fitness" onBack={onBack} onExit={onExit} />
      <div className="template-list">
        {templates.map((group) => (
          <section className="template-section in-list" key={group.group}>
            <p>{group.group}</p>
            <div className="template-grid">
              {group.items.map((item) => (
                <TemplateButton
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  glyph={item.glyph}
                  onClick={() => onSelect(item.label === 'Run' ? 'Go Running' : item.label, item.icon)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

function DetailRow({
  label,
  value,
  icon,
  iconTone = 'plain',
  color,
  chevron,
  muted,
  onClick,
}: {
  label: string
  value?: string
  icon?: string
  iconTone?: 'plain' | 'gradient'
  color?: string
  chevron?: boolean
  muted?: boolean
  onClick?: () => void
}) {
  return (
    <button className={`detail-field ${muted ? 'muted' : ''}`} type="button" onClick={onClick}>
      <span>{label}</span>
      {value && <strong>{value}</strong>}
      {icon && iconTone === 'gradient' ? (
        <span
          className="detail-icon-gradient"
          style={{ WebkitMaskImage: `url("${icon}")`, maskImage: `url("${icon}")` }}
        ></span>
      ) : icon && <img src={icon} alt="" />}
      {color && <i style={{ background: color }}></i>}
      {chevron && <img className="field-chevron" src={assets.chevron} alt="" />}
    </button>
  )
}

function TypeField({
  type,
  expanded,
  onToggle,
  onSelect,
}: {
  type: HabitType
  expanded: boolean
  onToggle: () => void
  onSelect: (type: HabitType) => void
}) {
  const typeOptions: { label: HabitType; icon: string; helper: string }[] = [
    { label: 'Make', icon: assets.typeMake, helper: 'Build a routine you want to do more often.' },
    { label: 'Limit', icon: assets.typeLimit, helper: 'Set a limit for something you want to do less.' },
    { label: 'Break', icon: assets.typeBreak, helper: 'Mark a habit that you want to avoid and break.' },
  ]
  const selected = typeOptions.find((option) => option.label === type) ?? typeOptions[0]

  return (
    <div className={`type-card ${expanded ? 'expanded' : ''}`}>
      <button type="button" onClick={onToggle}>
        <span className="type-copy">
          <img src={selected.icon} alt="" />
          <span>
            <strong>{selected.label}</strong>
            <em>{selected.helper}</em>
          </span>
        </span>
        {!expanded && <img className="field-chevron" src={assets.chevron} alt="" />}
      </button>
      {expanded && typeOptions.filter((option) => option.label !== type).map((option) => (
        <button key={option.label} type="button" onClick={() => onSelect(option.label)}>
          <span className="type-copy">
            <img src={option.icon} alt="" />
            <span>
              <strong>{option.label}</strong>
              <em>{option.helper}</em>
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

function DetailsStep({
  draft,
  popup,
  onPatch,
  onPopup,
  onNext,
  onBack,
  onExit,
}: {
  draft: DraftHabit
  popup: NewPopup
  onPatch: (patch: Partial<DraftHabit>) => void
  onPopup: (popup: NewPopup) => void
  onNext: () => void
  onBack: () => void
  onExit: () => void
}) {
  return (
    <section className="new-screen">
      <FlowNav progress={1 / 3} onBack={onBack} onExit={onExit} />
      <h1 className="flow-heading">Does this look right?</h1>
      <div className="flow-form details-form">
        <section className="field-group">
          <p>Details</p>
          <label className="detail-field text-input">
            <input
              type="text"
              value={draft.name}
              onChange={(event) => onPatch({ name: event.target.value })}
            />
          </label>
          <div className="field-pair">
            <DetailRow label="Icon" icon={draft.icon} iconTone="gradient" onClick={() => onPopup('icons')} />
            <DetailRow label="Color" color={draft.color} onClick={() => onPopup('colors')} />
          </div>
        </section>
        <section className="field-group">
          <p>Type</p>
          <TypeField
            type={draft.type}
            expanded={popup === 'types'}
            onToggle={() => onPopup(popup === 'types' ? null : 'types')}
            onSelect={(type) => {
              onPatch({ type })
              onPopup(null)
            }}
          />
        </section>
      </div>
      <button className="primary-flow-button" type="button" onClick={onNext}>Next</button>
      {(popup === 'icons' || popup === 'units') && <button className="drawer-backdrop" type="button" aria-label="Close popup" onClick={() => onPopup(null)} />}
      {popup === 'icons' && <IconDrawer onClose={() => onPopup(null)} onSelect={(icon) => { onPatch({ icon }); onPopup(null) }} />}
      {popup === 'colors' && <ColorPicker color={draft.color} onClose={() => onPopup(null)} onSelect={(color) => { onPatch({ color }); onPopup(null) }} />}
    </section>
  )
}

function IconDrawer({ onClose, onSelect }: { onClose: () => void; onSelect: (icon: string) => void }) {
  return (
    <section className="icon-drawer">
      <div className="drawer-grabber"></div>
      <IconButton className="drawer-close" icon={assets.close} label="Close icons" onClick={onClose} />
      <strong>Icons</strong>
      <div className="icon-grid">
        {iconDrawerAssets.map((icon, index) => (
          <button key={`${icon}-${index}`} type="button" onClick={() => onSelect(icon)}>
            <img src={icon} alt="" />
          </button>
        ))}
      </div>
    </section>
  )
}

function ColorPicker({
  color,
  onClose,
  onSelect,
}: {
  color: string
  onClose: () => void
  onSelect: (color: string) => void
}) {
  return (
    <div className="color-modal-backdrop" onClick={onClose}>
      <div className="color-modal" onClick={(event) => event.stopPropagation()}>
        {colors.map((option) => (
          <button className={color === option ? 'selected' : ''} key={option} type="button" onClick={() => onSelect(option)}>
            <span style={{ background: option }}></span>
          </button>
        ))}
      </div>
    </div>
  )
}

function FrequencyField({
  frequency,
  activeDays,
  expanded,
  onToggle,
  onFrequency,
  onDays,
}: {
  frequency: Frequency
  activeDays: string[]
  expanded: boolean
  onToggle: () => void
  onFrequency: (frequency: Frequency) => void
  onDays: (days: string[]) => void
}) {
  const toggleDay = (day: string, index: number) => {
    const key = `${day}-${index}`
    onDays(activeDays.includes(key) ? activeDays.filter((item) => item !== key) : [...activeDays, key])
  }

  return (
    <div className={`frequency-field ${expanded ? 'expanded' : ''}`}>
      <button className="frequency-head" type="button" onClick={onToggle}>
        <span>{frequency}</span>
        <img src={assets.chevron} alt="" />
      </button>
      {expanded && (
        <div className="frequency-panel">
          <div className="frequency-tabs">
            {(['Daily', 'Weekly', 'Monthly'] as Frequency[]).map((option) => (
              <button className={frequency === option ? 'selected' : ''} key={option} type="button" onClick={() => onFrequency(option)}>
                {option}
              </button>
            ))}
          </div>
          {frequency === 'Daily' ? (
            <div className="day-selector">
              {createDays.map((day, index) => {
                const key = `${day}-${index}`
                return (
                  <button className={activeDays.includes(key) ? 'selected' : ''} key={key} type="button" onClick={() => toggleDay(day, index)}>
                    {day}
                  </button>
                )
              })}
            </div>
          ) : (
            <label className="interval-field">
              <span>Every</span>
              <input inputMode="numeric" min={1} type="number" defaultValue={1} />
              <span>{frequency === 'Weekly' ? 'week' : 'month'}</span>
            </label>
          )}
        </div>
      )}
    </div>
  )
}

function GoalStep({
  draft,
  popup,
  error,
  onPatch,
  onPopup,
  onNext,
  onBack,
  onExit,
}: {
  draft: DraftHabit
  popup: NewPopup
  error: boolean
  onPatch: (patch: Partial<DraftHabit>) => void
  onPopup: (popup: NewPopup) => void
  onNext: () => void
  onBack: () => void
  onExit: () => void
}) {
  const fieldsReady = draft.quantity > 0 && Boolean(draft.unit)
  const canContinue = fieldsReady && Boolean(draft.timeOfDay)

  return (
    <section className="new-screen">
      <FlowNav progress={fieldsReady ? 5 / 6 : 2 / 3} onBack={onBack} onExit={onExit} />
      <h1 className="flow-heading time-heading">{fieldsReady ? 'What time of day should this be completed?' : 'What is your habit goal?'}</h1>
      <div className="flow-form goal-form">
        <section className="field-group">
          <p>Goal</p>
          <div className="field-pair">
            <label className="detail-field text-input">
              <input
                inputMode="numeric"
                min={1}
                type="number"
                placeholder="Value"
                value={draft.quantity || ''}
                onChange={(event) => onPatch({ quantity: event.target.value ? Math.max(1, Number(event.target.value)) : 0 })}
              />
            </label>
            <DetailRow label={draft.unit || 'Unit'} chevron muted={!draft.unit} onClick={() => onPopup('units')} />
          </div>
          <FrequencyField
            frequency={draft.frequency}
            activeDays={draft.activeDays}
            expanded={popup === 'types'}
            onToggle={() => onPopup(popup === 'types' ? null : 'types')}
            onFrequency={(frequency) => onPatch({ frequency })}
            onDays={(activeDays) => onPatch({ activeDays })}
          />
        </section>
        {fieldsReady && (
          <section className="field-group">
            <p>Time of day</p>
            <div className={`create-time-box ${error && !draft.timeOfDay ? 'error' : ''}`}>
              {createTimes.map((item) => (
                <button
                  className={draft.timeOfDay === item.label ? 'selected' : ''}
                  key={item.label}
                  type="button"
                  onClick={() => onPatch({ timeOfDay: item.label })}
                >
                  <img src={draft.timeOfDay === item.label ? item.selectedIcon : item.icon} alt="" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            {error && !draft.timeOfDay && <p className="field-error">Select time of day</p>}
          </section>
        )}
      </div>
      <button className={`primary-flow-button ${canContinue ? '' : 'disabled'}`} type="button" onClick={onNext}>Next</button>
      {popup === 'units' && <button className="drawer-backdrop" type="button" aria-label="Close popup" onClick={() => onPopup(null)} />}
      {popup === 'units' && <UnitDrawer onSelect={(unit) => { onPatch({ unit }); onPopup(null) }} />}
    </section>
  )
}

function UnitDrawer({ onSelect }: { onSelect: (unit: string) => void }) {
  return (
    <section className="unit-drawer">
      <div className="drawer-grabber"></div>
      <div className="unit-list">
        {units.map((unit) => (
          <button key={unit} type="button" onClick={() => onSelect(unit)}>{unit}</button>
        ))}
      </div>
    </section>
  )
}

function ReviewStep({
  draft,
  onPatch,
  onExit,
  onCreate,
}: {
  draft: DraftHabit
  onPatch: (patch: Partial<DraftHabit>) => void
  onExit: () => void
  onCreate: () => void
}) {
  const [popup, setPopup] = useState<NewPopup | 'frequency'>(null)

  return (
    <section className="new-screen review-screen">
      <FlowNav title={draft.name} onExit={onExit} />
      <div className="review-content">
        <section className="field-group">
          <p>Details</p>
          <DetailRow label={draft.name} />
          <div className="field-pair">
            <DetailRow label="Icon" icon={draft.icon} iconTone="gradient" onClick={() => setPopup('icons')} />
            <DetailRow label="Color" color={draft.color} onClick={() => setPopup('colors')} />
          </div>
        </section>
        <section className="field-group">
          <p>Type</p>
          <TypeField
            type={draft.type}
            expanded={popup === 'types'}
            onToggle={() => setPopup(popup === 'types' ? null : 'types')}
            onSelect={(type) => {
              onPatch({ type })
              setPopup(null)
            }}
          />
        </section>
        <section className="field-group">
          <p>Goal</p>
          <div className="field-pair">
            <DetailRow label={`${draft.quantity}`} />
            <DetailRow label={draft.unit} chevron onClick={() => setPopup('units')} />
          </div>
          <FrequencyField
            frequency={draft.frequency}
            activeDays={draft.activeDays}
            expanded={popup === 'frequency'}
            onToggle={() => setPopup(popup === 'frequency' ? null : 'frequency')}
            onFrequency={(frequency) => onPatch({ frequency })}
            onDays={(activeDays) => onPatch({ activeDays })}
          />
        </section>
        <section className="field-group">
          <p>Time of day</p>
          <div className="create-time-box">
            {createTimes.map((item) => (
              <button
                className={draft.timeOfDay === item.label ? 'selected' : ''}
                key={item.label}
                type="button"
                onClick={() => onPatch({ timeOfDay: item.label })}
              >
                <img src={draft.timeOfDay === item.label ? item.selectedIcon : item.icon} alt="" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="field-group">
          <p>Reminders</p>
          <DetailRow label="Create custom reminder" icon={assets.plus} />
        </section>
        <div className="field-pair date-pair">
          <section className="field-group">
            <p>Start Date</p>
            <DetailRow label="Today" />
          </section>
          <section className="field-group">
            <p>End Date</p>
            <DetailRow label="Never" />
          </section>
        </div>
      </div>
      <button className="primary-flow-button review-create-button" type="button" onClick={onCreate}>Create Habit</button>
      {(popup === 'icons' || popup === 'units') && <button className="drawer-backdrop" type="button" aria-label="Close popup" onClick={() => setPopup(null)} />}
      {popup === 'icons' && <IconDrawer onClose={() => setPopup(null)} onSelect={(icon) => { onPatch({ icon }); setPopup(null) }} />}
      {popup === 'colors' && <ColorPicker color={draft.color} onClose={() => setPopup(null)} onSelect={(color) => { onPatch({ color }); setPopup(null) }} />}
      {popup === 'units' && <UnitDrawer onSelect={(unit) => { onPatch({ unit }); setPopup(null) }} />}
    </section>
  )
}

function App() {
  const [tab, setTab] = useState<AppTab>('Home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [time, setTime] = useState<TimeKey>('All Day')
  const [habitDay, setHabitDay] = useState('We')
  const [calendarDay, setCalendarDay] = useState(calendarToday)
  const [habits, setHabits] = useState<Habit[]>([seededHabit])
  const [activeHabitId, setActiveHabitId] = useState(seededHabit.id)
  const [progressHabitId, setProgressHabitId] = useState<string | null>(null)
  const [progressByHabitDay, setProgressByHabitDay] = useState<Record<string, Record<string, number>>>({
    [seededHabit.id]: { [todayWeekKey]: 0 },
  })
  const [skippedByHabitDay, setSkippedByHabitDay] = useState<Record<string, Record<string, boolean>>>({})
  const [createdThisMonthCount, setCreatedThisMonthCount] = useState(0)
  const [newStep, setNewStep] = useState<NewStep>('landing')
  const [newPopup, setNewPopup] = useState<NewPopup>(null)
  const [typedName, setTypedName] = useState('')
  const [draft, setDraft] = useState<DraftHabit>(() => createDraft())
  const [showTimeError, setShowTimeError] = useState(false)

  const activeHabit = habits.find((habit) => habit.id === activeHabitId) ?? habits[0]
  const progressHabit = habits.find((habit) => habit.id === progressHabitId) ?? null
  const visibleHabits = habits.filter((habit) => habit.timeOfDay === time)
  const selectedDateLabel = calendarDay === calendarToday ? 'Today' : `June ${formatOrdinal(calendarDay)}`
  const activeHomeDayKey = getCalendarDayKey(calendarDay)

  const getSeededHistoricalValue = (habit: Habit, day: number) => {
    if (habit.id !== seededHabit.id || day >= calendarToday) return 0
    const tone = calendarDotPattern[(day - 1) % calendarDotPattern.length]
    return Math.min(habit.quantity, seededProgressByTone[tone] ?? 0)
  }

  const getHabitDayValue = (habit: Habit, dayKey = activeHomeDayKey) => {
    const storedValue = progressByHabitDay[habit.id]?.[dayKey]
    if (typeof storedValue === 'number') return storedValue
    if (dayKey === getCalendarDayKey(calendarDay)) return getSeededHistoricalValue(habit, calendarDay)
    return 0
  }

  const getCalendarDayTone = (day: number) => {
    const dayKey = getCalendarDayKey(day)
    const storedValue = progressByHabitDay[seededHabit.id]?.[dayKey]
    if (typeof storedValue === 'number') {
      return getCalendarToneForProgress(storedValue, seededHabit.quantity)
    }
    return calendarDotPattern[(day - 1) % calendarDotPattern.length]
  }

  const getHabitStat = (habit: Habit): HabitCompletionStat => {
    const progressDays = progressByHabitDay[habit.id] ?? {}
    const skipDays = skippedByHabitDay[habit.id] ?? {}
    const activeDayKeys = Array.from(new Set([todayWeekKey, ...Object.keys(progressDays), ...Object.keys(skipDays)]))
    const todayRatio = getProgressRatio(progressDays[todayWeekKey] ?? 0, habit.quantity)
    const completedDays = activeDayKeys.filter((day) => getProgressRatio(progressDays[day] ?? 0, habit.quantity) >= 1).length
    const skippedDays = activeDayKeys.filter((day) => skipDays[day]).length
    const activeDays = Math.max(1, activeDayKeys.length)
    const missedDays = activeDayKeys.filter(
      (day) => day !== todayWeekKey && !skipDays[day] && (progressDays[day] ?? 0) <= 0
    ).length
    const completionRate = Math.round((completedDays / activeDays) * 100)

    return {
      activeDays,
      completedDays,
      missedDays,
      skippedDays,
      completionRate,
      trend: completionRate > 0 ? Math.max(4, Math.round(completionRate * 0.06)) : 0,
      todayRatio,
    }
  }

  const statsByHabit = habits.reduce<Record<string, HabitCompletionStat>>((stats, habit) => {
    stats[habit.id] = getHabitStat(habit)
    return stats
  }, {})

  const completedTodayCount = habits.filter((habit) => statsByHabit[habit.id]?.completedDays).length
  const skippedTodayCount = habits.filter((habit) => statsByHabit[habit.id]?.skippedDays).length
  const allHabitsCompleteToday = habits.length > 0 && completedTodayCount === habits.length
  const currentStreak = defaultCurrentStreak + (allHabitsCompleteToday ? 1 : 0)
  const monthStats: MonthBreakdownStats = {
    completed: 13 + completedTodayCount,
    missed: 13,
    skipped: 13 + skippedTodayCount,
    newHabits: 13 + createdThisMonthCount,
    completionRate: Math.min(100, 72 + completedTodayCount * 2 - skippedTodayCount),
    trend: 6 + completedTodayCount,
  }

  const currentValue = useMemo(() => {
    if (!activeHabit) return 0
    if (overlay === 'habit' || overlay === 'menu' || overlay === 'edit') {
      return getHabitDayValue(activeHabit, habitDay)
    }
    return getHabitDayValue(activeHabit)
  }, [activeHabit, calendarDay, habitDay, overlay, progressByHabitDay])

  const resetNewFlow = () => {
    setNewStep('landing')
    setNewPopup(null)
    setTypedName('')
    setDraft(createDraft())
    setShowTimeError(false)
  }

  const goNew = () => {
    resetNewFlow()
    setOverlay(null)
    setTab('New')
  }

  const removeHabit = (id: string) => {
    setHabits((previous) => previous.filter((habit) => habit.id !== id))
    setProgressByHabitDay((previous) => {
      const next = { ...previous }
      delete next[id]
      return next
    })
    setSkippedByHabitDay((previous) => {
      const next = { ...previous }
      delete next[id]
      return next
    })
    setProgressHabitId((previous) => (previous === id ? null : previous))
    setOverlay(null)
  }

  const patchDraft = (patch: Partial<DraftHabit>) => {
    setDraft((previous) => ({ ...previous, ...patch }))
    if (patch.timeOfDay) setShowTimeError(false)
  }

  const createHabit = () => {
    if (!draft.timeOfDay) return
    const nextHabit: Habit = {
      ...draft,
      id: `habit-${Date.now()}`,
      unit: draft.unit || 'Miles',
      quantity: draft.quantity || 4,
      timeOfDay: draft.timeOfDay,
    }
    setHabits((previous) => [...previous, nextHabit])
    setProgressByHabitDay((previous) => ({ ...previous, [nextHabit.id]: { [todayWeekKey]: 0 } }))
    setCreatedThisMonthCount((previous) => previous + 1)
    setActiveHabitId(nextHabit.id)
    setTime(nextHabit.timeOfDay)
    resetNewFlow()
    setTab('Home')
  }

  const handleNavigate = (nextTab: AppTab) => {
    if (nextTab === 'New') {
      goNew()
      return
    }
    setOverlay(null)
    if (nextTab !== 'Progress') setProgressHabitId(null)
    setTab(nextTab)
  }

  const selectCalendarDay = (day: number) => {
    setCalendarDay(day)
    setHabitDay(getCalendarDayKey(day))
  }

  const returnToToday = () => {
    setCalendarDay(calendarToday)
    setHabitDay(todayWeekKey)
  }

  const setHabitDayValue = (habitId: string, day: string, value: number) => {
    setProgressByHabitDay((previous) => ({
      ...previous,
      [habitId]: { ...(previous[habitId] ?? {}), [day]: value },
    }))
    if (value > 0) {
      setSkippedByHabitDay((previous) => ({
        ...previous,
        [habitId]: { ...(previous[habitId] ?? {}), [day]: false },
      }))
    }
  }

  return (
    <div className="phone-shell">
      <div className="app-screen">
        {tab === 'Home' && (
          <>
            <TopBar dateLabel={selectedDateLabel} onCalendar={() => setOverlay(overlay === 'calendar' ? null : 'calendar')} />
            <TimeSelector selected={time} onSelect={setTime} />

            {visibleHabits.length > 0 ? (
              <main className="home-list">
                {visibleHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    value={getHabitDayValue(habit)}
                    onOpen={() => {
                      setActiveHabitId(habit.id)
                      setHabitDay(activeHomeDayKey)
                      setOverlay('habit')
                    }}
                    onIncrement={() => setHabitDayValue(
                      habit.id,
                      activeHomeDayKey,
                      Math.min(habit.quantity, getHabitDayValue(habit) + 1),
                    )}
                  />
                ))}
              </main>
            ) : habits.length === 0 ? (
              <EmptyHome onNew={goNew} />
            ) : null}

            {overlay === 'calendar' && (
              <>
                <button className="calendar-backdrop" type="button" aria-label="Close calendar" onClick={() => setOverlay(null)} />
                <CalendarOverlay
                  selectedDay={calendarDay}
                  onClose={() => setOverlay(null)}
                  onReturn={returnToToday}
                  onSelectDay={selectCalendarDay}
                  getDayTone={getCalendarDayTone}
                />
              </>
            )}

            {overlay === 'habit' && (
              <button className="overlay-dismiss" type="button" aria-label="Close habit overlay" onClick={() => setOverlay(null)} />
            )}

            {activeHabit && overlay === 'habit' && (
              <HabitOverlay
                habit={activeHabit}
                day={habitDay}
                progressByDay={progressByHabitDay[activeHabit.id] ?? {}}
                value={currentValue}
                onDay={setHabitDay}
                onMenu={() => setOverlay('menu')}
                onReturnToday={() => setHabitDay('We')}
                onValue={(value) => setHabitDayValue(activeHabit.id, habitDay, value)}
              />
            )}

            {activeHabit && overlay === 'menu' && (
              <>
                <button className="menu-dismiss" type="button" aria-label="Close habit menu" onClick={() => setOverlay('habit')} />
                <HabitOverlay
                  habit={activeHabit}
                  day={habitDay}
                  progressByDay={progressByHabitDay[activeHabit.id] ?? {}}
                  value={currentValue}
                  onDay={setHabitDay}
                  onMenu={() => setOverlay('habit')}
                  onReturnToday={() => setHabitDay('We')}
                  onValue={(value) => setHabitDayValue(activeHabit.id, habitDay, value)}
                />
                <HabitMenu
                  onArchive={() => removeHabit(activeHabit.id)}
                  onDelete={() => removeHabit(activeHabit.id)}
                  onEdit={() => setOverlay('edit')}
                  onSkip={() => {
                    setHabitDayValue(activeHabit.id, habitDay, 0)
                    setSkippedByHabitDay((previous) => ({
                      ...previous,
                      [activeHabit.id]: { ...(previous[activeHabit.id] ?? {}), [habitDay]: true },
                    }))
                    setOverlay('habit')
                  }}
                />
              </>
            )}

            {activeHabit && overlay === 'edit' && (
              <EditHabit
                habit={activeHabit}
                onBack={() => setOverlay('habit')}
                onDelete={() => removeHabit(activeHabit.id)}
                onSave={(updatedHabit) => {
                  setHabits((previous) => previous.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit)))
                  setProgressByHabitDay((previous) => ({
                    ...previous,
                    [updatedHabit.id]: {
                      ...(previous[updatedHabit.id] ?? {}),
                      [habitDay]: Math.min(previous[updatedHabit.id]?.[habitDay] ?? 0, updatedHabit.quantity),
                    },
                  }))
                  setActiveHabitId(updatedHabit.id)
                  setTime(updatedHabit.timeOfDay)
                  setOverlay('habit')
                }}
              />
            )}
          </>
        )}

        {tab === 'New' && (
          <>
            {newStep === 'landing' && (
              <NewLanding
                draftName={typedName}
                onName={setTypedName}
                onCustom={() => {
                  setDraft(createDraft(typedName.trim(), assets.run))
                  setNewStep('details')
                }}
                onCategory={() => setNewStep('templates')}
              />
            )}
            {newStep === 'templates' && (
              <TemplateList
                onBack={() => setNewStep('landing')}
                onExit={resetNewFlow}
                onSelect={(name, icon) => {
                  setDraft(createDraft(name, icon, 'All Day', true))
                  setNewStep('review')
                }}
              />
            )}
            {newStep === 'details' && (
              <DetailsStep
                draft={draft}
                popup={newPopup}
                onPatch={patchDraft}
                onPopup={setNewPopup}
                onBack={() => setNewStep('landing')}
                onExit={resetNewFlow}
                onNext={() => {
                  setNewPopup(null)
                  setNewStep('goal')
                }}
              />
            )}
            {newStep === 'goal' && (
              <GoalStep
                draft={draft}
                popup={newPopup}
                error={showTimeError}
                onPatch={patchDraft}
                onPopup={setNewPopup}
                onBack={() => setNewStep('details')}
                onExit={resetNewFlow}
                onNext={() => {
                  if (!draft.timeOfDay) {
                    setShowTimeError(true)
                    return
                  }
                  setNewPopup(null)
                  setNewStep('review')
                }}
              />
            )}
            {newStep === 'review' && (
              <ReviewStep
                draft={draft}
                onPatch={patchDraft}
                onExit={resetNewFlow}
                onCreate={createHabit}
              />
            )}
          </>
        )}

        {tab === 'Progress' && !progressHabit && (
          <ProgressMain
            habits={habits}
            statsByHabit={statsByHabit}
            monthStats={monthStats}
            currentStreak={currentStreak}
            onHabit={setProgressHabitId}
          />
        )}

        {tab === 'Progress' && progressHabit && (
          <ProgressHabitDetail
            habit={progressHabit}
            stat={statsByHabit[progressHabit.id]}
            onBack={() => setProgressHabitId(null)}
          />
        )}

      {(tab !== 'New' || newStep === 'landing') && !progressHabit && <BottomNav active={tab} onNavigate={handleNavigate} />}
      </div>
    </div>
  )
}

export default App
