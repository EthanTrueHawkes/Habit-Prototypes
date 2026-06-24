import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './App.css'

const assets = {
  sort: './figma-assets/sort.svg',
  chevron: './figma-assets/chevron.svg',
  profile: './figma-assets/profile.svg',
  home: './figma-assets/home.svg',
  addOutline: './figma-assets/addOutline.svg',
  stats: './figma-assets/stats.svg',
  plus: './figma-assets/plus.svg',
  close: './figma-assets/close.svg',
  pencil: './figma-assets/pencil.svg',
  redo: './figma-assets/redo.svg',
  archive: './figma-assets/archive.svg',
  trash: './figma-assets/trash.svg',
  return: './figma-assets/return.svg',
  back: './figma-assets/back.svg',
  caret: './figma-assets/caret.svg',
  check: './figma-assets/check.svg',
  bell: './figma-assets/bell.svg',
  date: './figma-assets/date.svg',
  createBack: './figma-assets/createBack.svg',
  createClose: './figma-assets/createClose.svg',
  createCaret: './figma-assets/createCaret.svg',
  createPin: './figma-assets/createPin.svg',
  createHourglass: './figma-assets/createHourglass.svg',
  createBreak: './figma-assets/createBreak.svg',
  colorPicked: './figma-assets/colorPicked.svg',
  rowEllipseTrack: './figma-assets/rowEllipseTrack.svg',
  rowEllipseFill: './figma-assets/rowEllipseFill.svg',
  largeEllipseTrack: './figma-assets/largeEllipseTrack.svg',
  largeEllipseFill: './figma-assets/largeEllipseFill.svg',
  dayEmpty: './figma-assets/dayEmpty.svg',
  dayGreenHalf: './figma-assets/dayGreenHalf.svg',
  dayGreenBase: './figma-assets/dayGreenBase.svg',
  dayBlueBase: './figma-assets/dayBlueBase.svg',
  dayBlueHalf: './figma-assets/dayBlueHalf.svg',
  streakFlame: './figma-assets/streakFlame.svg',
}

type HabitDay = 'Th' | 'Fr' | 'Sa' | 'Su' | 'Mo' | 'Tu' | 'We'
type HomeTab = 'All Day' | 'Morning' | 'Afternoon' | 'Evening'
type View = 'home' | 'edit' | 'new'
type CreateStep = 'start' | 'templates' | 'details' | 'goal' | 'time' | 'review'
type Frequency = 'Daily' | 'Weekly' | 'Monthly'

type Habit = {
  name: string
  icon: string
  color: string
  type: 'Make' | 'Limit' | 'Break'
  goal: number
  unit: string
  frequency: Frequency
  activeDays: string[]
  timeOfDay: HomeTab
}

type CreateDraft = Habit

const habitDays: HabitDay[] = ['Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We']
const todayHabitDay: HabitDay = 'We'
const runningIcon = '\u{1F3C3}\u200D\u2640\uFE0F'
const clipboardIcon = '\u{1F4CB}\uFE0F'

const defaultRunningHabit: Habit = {
  name: 'Go Running',
  icon: runningIcon,
  color: '#005d8f',
  type: 'Make',
  goal: 4,
  unit: 'Miles',
  frequency: 'Daily',
  activeDays: ['M', 'T', 'W', 'T2', 'F', 'S'],
  timeOfDay: 'All Day',
}

const categoryItems = [
  ['\u{1F3C3}\u{1F3FD}', 'Fitness'],
  ['\u2764\uFE0F', 'Health'],
  ['\u{1F4DA}', 'Learn'],
  ['\u{1F6CF}\uFE0F', 'Personal'],
  ['\u{1F4B5}', 'Finance'],
  ['\u{1FAF1}\u{1F3FC}\u200D\u{1FAF2}\u{1F3FD}', 'Relationships'],
  ['\u{1F4BC}', 'Work'],
  ['\u{1F331}', 'Lifestyle'],
] as const

const templateSections = [
  {
    title: 'Cardio',
    items: [
      ['\u{1F3C3}\u{1F3FD}', 'Walk'],
      ['\u{1F3C3}', 'Run'],
      ['\u{1F6B2}', 'Bike'],
      ['\u{1F3CA}\u200D\u2640\uFE0F', 'Swim'],
      ['\u{1F3C0}', 'Sports'],
      ['\u{1F97E}', 'Hike'],
      ['\u{1F5FA}\uFE0F', 'Long Distance'],
      ['\u{1F97E}', 'Stairs'],
    ],
  },
  {
    title: 'Strength',
    items: [
      ['\u{1F3CB}\uFE0F', 'Long Distance'],
      ['\u{1F4AA}', 'Push Ups'],
      ['\u{1F4AA}\uFE0F', 'Squats'],
      ['\u{1F4AA}', 'Pull Ups'],
      ['\u{1F9D8}', 'Plank'],
      ['\u{1F9B5}', 'Lunges'],
    ],
  },
  {
    title: 'Mobility',
    items: [
      ['\u{1F938}\u200D\u2640\uFE0F', 'Stretch'],
      ['\u{1F9D8}\u200D\u2640\uFE0F', 'Yoga'],
    ],
  },
] as const

const unitOptions = ['Done', 'Times', 'Miles', 'Pages', 'Minutes', 'Hours', 'Cups', 'Custom']
const paletteColors = [
  '#4fb9f3',
  '#63e578',
  '#f17eda',
  '#efb74f',
  '#ec6a6a',
  '#c165eb',
  '#f6f7fa',
  '#be1b1b',
  '#3e960e',
  '#9e0974',
  '#cc6a14',
  '#005d8f',
]

type CalendarCell = { label: string; color: string; future?: boolean } | null
type JuneProgressByDate = Record<string, number>

function progressValueForCalendarColor(color: string, goal: number) {
  if (color === '#e4e7d2') return 0
  if (color === '#97da90') return Math.max(1, Math.floor(goal * 0.33))
  if (color === '#37a398') return Math.max(1, Math.floor(goal * 0.66))
  if (color === '#005d8f') return goal
  return 0
}

function calendarColorForProgressValue(value: number, goal: number) {
  const progress = goal > 0 ? value / goal : 0
  if (value <= 0) return '#e4e7d2'
  if (progress <= 0.33) return '#97da90'
  if (progress <= 0.66) return '#37a398'
  return '#005d8f'
}

function formatJuneDate(date: string) {
  if (date === 'today') return 'Today'

  const day = Number(date)
  const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'
  return `June ${date}${suffix}`
}

const monthCells: CalendarCell[] = [
  { label: '1', color: '#97da90' },
  { label: '2', color: '#e4e7d2' },
  { label: '3', color: '#005d8f' },
  { label: '4', color: '#37a398' },
  { label: '5', color: '#97da90' },
  { label: '6', color: '#005d8f' },
  { label: '7', color: '#37a398' },
  { label: '8', color: '#005d8f' },
  { label: '9', color: '#97da90' },
  { label: '10', color: '#37a398' },
  { label: '11', color: '#37a398' },
  { label: '12', color: '#e4e7d2' },
  { label: '13', color: '#e4e7d2' },
  { label: '14', color: '#97da90' },
  { label: '15', color: '#e4e7d2' },
  { label: '16', color: '#005d8f' },
  { label: '17', color: '#97da90' },
  { label: '18', color: '#005d8f' },
  { label: '19', color: '#37a398' },
  { label: '20', color: '#37a398' },
  { label: '21', color: '#97da90' },
  { label: '22', color: '#e4e7d2' },
  { label: '23', color: '#005d8f' },
  { label: '24', color: '#37a398' },
  { label: '25', color: '#005d8f' },
  { label: '26', color: '#005d8f' },
  { label: '27', color: '#97da90' },
  { label: '28', color: '#37a398' },
  { label: '29', color: '#97da90' },
  { label: '30', color: '#37a398' },
  null,
]

const initialJuneProgressByDate: JuneProgressByDate = monthCells.reduce<JuneProgressByDate>((history, cell) => {
  if (cell && Number(cell.label) <= 10) {
    history[cell.label] = progressValueForCalendarColor(cell.color, defaultRunningHabit.goal)
  }
  return history
}, { 10: 0 })

const habitDayToJuneDate: Record<HabitDay, string> = {
  Th: '4',
  Fr: '5',
  Sa: '6',
  Su: '7',
  Mo: '8',
  Tu: '9',
  We: '10',
}

const juneDateToHabitDay: Record<string, HabitDay> = Object.fromEntries(
  Object.entries(habitDayToJuneDate).map(([day, date]) => [date, day]),
) as Record<string, HabitDay>

const pastCalendarMonths: Array<{ title: string; cells: CalendarCell[] }> = [
  {
    title: 'May',
    cells: [
      null, null, null, null,
      { label: '1', color: '#005d8f' },
      { label: '2', color: '#37a398' },
      { label: '3', color: '#97da90' },
      { label: '4', color: '#005d8f' },
      { label: '5', color: '#e4e7d2' },
      { label: '6', color: '#005d8f' },
      { label: '7', color: '#37a398' },
      { label: '8', color: '#97da90' },
      { label: '9', color: '#005d8f' },
      { label: '10', color: '#37a398' },
      { label: '11', color: '#97da90' },
      { label: '12', color: '#e4e7d2' },
      { label: '13', color: '#005d8f' },
      { label: '14', color: '#37a398' },
      { label: '15', color: '#97da90' },
      { label: '16', color: '#e4e7d2' },
      { label: '17', color: '#005d8f' },
      { label: '18', color: '#37a398' },
      { label: '19', color: '#97da90' },
      { label: '20', color: '#005d8f' },
      { label: '21', color: '#37a398' },
      { label: '22', color: '#e4e7d2' },
      { label: '23', color: '#005d8f' },
      { label: '24', color: '#97da90' },
      { label: '25', color: '#37a398' },
      { label: '26', color: '#005d8f' },
      { label: '27', color: '#e4e7d2' },
      { label: '28', color: '#97da90' },
      { label: '29', color: '#37a398' },
      { label: '30', color: '#005d8f' },
      { label: '31', color: '#97da90' },
    ],
  },
  {
    title: 'April',
    cells: [
      null, null,
      { label: '1', color: '#97da90' },
      { label: '2', color: '#37a398' },
      { label: '3', color: '#005d8f' },
      { label: '4', color: '#e4e7d2' },
      { label: '5', color: '#97da90' },
      { label: '6', color: '#005d8f' },
      { label: '7', color: '#37a398' },
      { label: '8', color: '#e4e7d2' },
      { label: '9', color: '#97da90' },
      { label: '10', color: '#005d8f' },
      { label: '11', color: '#37a398' },
      { label: '12', color: '#e4e7d2' },
      { label: '13', color: '#005d8f' },
      { label: '14', color: '#97da90' },
      { label: '15', color: '#37a398' },
      { label: '16', color: '#005d8f' },
      { label: '17', color: '#e4e7d2' },
      { label: '18', color: '#97da90' },
      { label: '19', color: '#37a398' },
      { label: '20', color: '#005d8f' },
      { label: '21', color: '#e4e7d2' },
      { label: '22', color: '#97da90' },
      { label: '23', color: '#005d8f' },
      { label: '24', color: '#37a398' },
      { label: '25', color: '#e4e7d2' },
      { label: '26', color: '#97da90' },
      { label: '27', color: '#005d8f' },
      { label: '28', color: '#37a398' },
      { label: '29', color: '#97da90' },
      { label: '30', color: '#005d8f' },
    ],
  },
  {
    title: 'March',
    cells: [null, null, null, null, null, null, ...Array.from({ length: 31 }, (_, index) => ({
      label: String(index + 1),
      color: ['#005d8f', '#37a398', '#97da90', '#e4e7d2'][index % 4],
    }))],
  },
  {
    title: 'February',
    cells: [null, null, null, null, null, null, ...Array.from({ length: 28 }, (_, index) => ({
      label: String(index + 1),
      color: ['#97da90', '#005d8f', '#e4e7d2', '#37a398'][index % 4],
    }))],
  },
  {
    title: 'January',
    cells: [null, null, null, ...Array.from({ length: 31 }, (_, index) => ({
      label: String(index + 1),
      color: ['#e4e7d2', '#005d8f', '#37a398', '#97da90'][index % 4],
    }))],
  },
  {
    title: 'December',
    cells: [...Array.from({ length: 31 }, (_, index) => ({
      label: String(index + 1),
      color: ['#37a398', '#97da90', '#005d8f', '#e4e7d2'][index % 4],
    }))],
  },
]

const heatmapColors = {
  empty: '#ebede1',
  green: '#bee1ba',
  teal: '#269489',
  blue: '#006297',
} as const

const monthCards = [
  {
    title: 'May',
    rows: [
      { offset: 5, cells: ['blue', 'green'] },
      { offset: 0, cells: ['teal', 'green', 'empty', 'blue', 'teal', 'green', 'blue'] },
      { offset: 0, cells: ['blue', 'teal', 'empty', 'blue', 'green', 'teal', 'empty'] },
      { offset: 0, cells: ['teal', 'blue', 'green', 'empty', 'blue', 'green', 'teal'] },
      { offset: 0, cells: ['blue', 'teal', 'empty', 'green', 'teal', 'blue', 'green'] },
      { offset: 0, cells: ['empty'] },
    ],
  },
  {
    title: 'June',
    rows: [
      { offset: 1, cells: ['green', 'teal', 'blue', 'empty', 'teal', 'green'] },
      { offset: 0, cells: ['teal', 'blue', 'green', 'empty', 'blue', 'teal', 'empty'] },
      { offset: 0, cells: ['green', 'teal', 'blue', 'empty', 'green', 'blue', 'teal'] },
      { offset: 0, cells: ['blue', 'green', 'empty', 'teal', 'blue', 'empty', 'green'] },
      { offset: 0, cells: ['empty', 'teal', 'green'] },
    ],
  },
] as const

function Icon({ src, size = 24 }: { src: string; size?: number }) {
  return <img alt="" src={src} style={{ width: size, height: size }} />
}

function ProgressDonut({
  value,
  goal,
  className,
}: {
  value: number
  goal: number
  className: string
}) {
  const progress = goal > 0 ? Math.max(0, Math.min(value / goal, 1)) : 0
  const progressStyle = { '--progress': `${progress * 360}deg` } as CSSProperties

  return (
    <span
      className={`progress-donut ${className} ${progress === 0 ? 'is-empty' : ''}`}
      style={progressStyle}
      aria-hidden="true"
    />
  )
}

function DayProgressTile({
  day,
  value,
  goal,
  selected,
  isToday,
  onSelect,
}: {
  day: HabitDay
  value: number
  goal: number
  selected: boolean
  isToday: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={`${selected ? 'selected' : ''} ${isToday ? 'today' : 'past-day'}`}
      type="button"
      onClick={onSelect}
    >
      <ProgressDonut value={value} goal={goal} className="day-donut" />
      <b>{day}</b>
    </button>
  )
}

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <span className="status-icons">
        <span className="signal-bars"><i /><i /><i /></span>
        <span className="wifi-mark" />
        <span className="battery-mark" />
      </span>
    </div>
  )
}

function TopBar({
  title,
  activeTab,
  onCalendar,
  onTab,
}: {
  title: string
  activeTab: HomeTab
  onCalendar: () => void
  onTab: (tab: HomeTab) => void
}) {
  const tabs: HomeTab[] = ['All Day', 'Morning', 'Afternoon', 'Evening']
  return (
    <header className="top-bar">
      <StatusBar />
      <div className="top-row">
        <button className="title-button" type="button" onClick={onCalendar}>
          <span>{title}</span>
          <Icon src={assets.chevron} size={12} />
        </button>
        <button className="square sort-button" type="button" aria-label="Sort">
          <Icon src={assets.sort} />
        </button>
        <button className="square profile-button" type="button" aria-label="Profile">
          <Icon src={assets.profile} />
        </button>
      </div>
      <div className="section-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? 'active' : ''}
            type="button"
            onClick={() => onTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={`top-rule tab-${tabs.indexOf(activeTab)}`} />
    </header>
  )
}

function BottomNav({
  showLabels,
  active,
  onHome,
  onNew,
}: {
  showLabels: boolean
  active: 'home' | 'new' | 'progress'
  onHome: () => void
  onNew: () => void
}) {
  return (
    <nav className={`bottom-nav ${showLabels ? 'with-labels' : 'icons-only'}`} aria-label="Main">
      <button className={`nav-item ${active === 'home' ? 'active' : ''}`} type="button" onClick={onHome}>
        <span className="nav-box">
          <Icon src={assets.home} size={32} />
        </span>
        <span className="nav-label">Home</span>
      </button>
      <button className={`nav-item ${active === 'new' ? 'active' : ''}`} type="button" onClick={onNew}>
        <span className="nav-box">
          <Icon src={assets.addOutline} size={32} />
        </span>
        <span className="nav-label">New</span>
      </button>
      <button className={`nav-item ${active === 'progress' ? 'active' : ''}`} type="button">
        <span className="nav-box">
          <Icon src={assets.stats} size={32} />
        </span>
        <span className="nav-label">Progress</span>
      </button>
    </nav>
  )
}

function HabitRow({
  hasHabit,
  habit,
  value,
  streak,
  onOpen,
  onIncrement,
}: {
  hasHabit: boolean
  habit: Habit
  value: number
  streak: number
  onOpen: () => void
  onIncrement: () => void
}) {
  const title = hasHabit ? habit.name : 'Make a new habit'
  const amount = hasHabit ? `${value}/${habit.goal} ${habit.unit}` : '0/4 Miles'
  return (
    <div className={`habit-list ${hasHabit ? 'seeded' : 'empty-seed'}`}>
      <button className="habit-row" type="button" onClick={hasHabit ? onOpen : undefined}>
        <div className="small-ring">
          <ProgressDonut value={hasHabit ? value : 0} goal={habit.goal} className="small-donut" />
          <span className="habit-icon">{hasHabit ? habit.icon : clipboardIcon}</span>
          <span>{hasHabit ? '🏃‍♀️' : '📋️'}</span>
        </div>
        <div className="habit-copy">
          <b>{title}</b>
          <strong>{amount}</strong>
        </div>
        {hasHabit && streak > 0 && (
          <div className="streak">
            <div>
              <b>{streak}</b>
              <span>day </span>
            </div>
            <span>streak</span>
          </div>
        )}
      </button>
      <button
        className="habit-plus"
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          if (hasHabit) onIncrement()
        }}
        aria-label="Add progress"
      >
        <Icon src={assets.plus} />
      </button>
    </div>
  )
}

function HomeEmpty() {
  return (
    <div className="empty-message">
      <p>Welcome</p>
      <p>Time to make your first habit</p>
    </div>
  )
}

function HabitMenu({
  onEdit,
  onArchive,
  onDelete,
}: {
  onEdit: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  return (
    <div className="habit-menu" onClick={(event) => event.stopPropagation()}>
      <button type="button" onClick={onEdit}>
        <Icon src={assets.pencil} />
        <span>Edit Habit</span>
      </button>
      <button type="button">
        <Icon src={assets.redo} />
        <span>Skip Today </span>
      </button>
      <button type="button" onClick={onArchive}>
        <Icon src={assets.archive} size={20} />
        <span>Archive Habit</span>
      </button>
      <button type="button" onClick={onDelete} className="danger">
        <Icon src={assets.trash} />
        <span>Delete Habit</span>
      </button>
    </div>
  )
}

function HabitSheet({
  habit,
  day,
  value,
  onDay,
  onToday,
  onClose,
  onValue,
  onEdit,
  onArchive,
  onDelete,
  progressByDay,
}: {
  habit: Habit
  day: HabitDay
  value: number
  onDay: (day: HabitDay) => void
  onToday: () => void
  onClose: () => void
  onValue: (value: number) => void
  onEdit: () => void
  onArchive: () => void
  onDelete: () => void
  progressByDay: Record<HabitDay, number>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className={`habit-sheet ${day !== todayHabitDay ? 'has-return' : ''}`} onClick={(event) => {
      event.stopPropagation()
      if (menuOpen) setMenuOpen(false)
    }}>
      <button className="sheet-handle" type="button" onClick={onClose} aria-label="Close habit" />
      <div className="sheet-title">
        <div>
          <h2>{habit.name}</h2>
          <p className="sheet-meta">{habit.frequency} <span>•</span> {habit.timeOfDay}</p>
          <p>Daily <span>•</span> All Day</p>
        </div>
        <button
          className="sheet-dots"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          <span>⋮</span>
        </button>
        {menuOpen && (
          <HabitMenu onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} />
        )}
      </div>
      <div className="sheet-progress">
        <div className="large-ring">
          <ProgressDonut value={value} goal={habit.goal} className="large-donut" />
          <span className="habit-icon">{habit.icon}</span>
          <span>🏃‍♀️</span>
        </div>
        <input
          value={value}
          inputMode="numeric"
          aria-label="Progress value"
          onChange={(event) => {
            const next = Number(event.target.value)
            if (!Number.isNaN(next)) onValue(Math.max(0, Math.min(next, habit.goal)))
          }}
        />
        <div className="step-buttons">
          <button type="button" onClick={() => onValue(Math.max(0, value - 1))}>
            −
          </button>
          <button type="button" onClick={() => onValue(Math.min(habit.goal, value + 1))}>
            +
          </button>
        </div>
      </div>
      <div className="day-strip">
        {habitDays.map((item) => (
          <DayProgressTile
            key={item}
            day={item}
            value={progressByDay[item]}
            goal={habit.goal}
            selected={item === day}
            isToday={item === todayHabitDay}
            onSelect={() => onDay(item)}
          />
        ))}
      </div>
      {day !== todayHabitDay && (
        <button className="return-today sheet-return" type="button" onClick={onToday}>
          <span className="return-icon">↩</span>
          <b>Return to today</b>
        </button>
      )}
      <section className="sheet-streaks">
        <div>
          <b>
            <img src={assets.streakFlame} alt="" />
            {value >= habit.goal ? 1 : 0} Day
          </b>
          <span>Current Streak</span>
        </div>
        <div>
          <b>13 Days</b>
          <span>Best Streak</span>
        </div>
      </section>
      <section className="sheet-section no-op">
        <div className="month-cards">
          {monthCards.map((month) => (
            <div className="month-card" key={month.title}>
              <h3>{month.title}</h3>
              <div className="month-weekdays" aria-hidden="true">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((weekday, index) => (
                  <span key={`${month.title}-${weekday}-${index}`}>{weekday}</span>
                ))}
              </div>
              <div className="github-grid">
                {month.rows.map((row, rowIndex) => (
                  <div key={`${month.title}-row-${rowIndex}`}>
                    {row.cells.map((level, index) => (
                      <span
                        key={`${month.title}-${rowIndex}-${index}`}
                        style={{ backgroundColor: heatmapColors[level] }}
                        className={index === 0 ? `offset-${row.offset}` : undefined}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="month-card-foot">
          <b>See All</b>
          <span><i /> Less <i className="more" /> More</span>
        </div>
        <div className="completion-row">
          <span>Monthly Completion Rate</span>
          <b>93%</b>
        </div>
        <div className="completion-bar"><span /></div>
      </section>
      <section className="sheet-stats no-op">
        <div>
          <span>Completed</span>
          <b>13 habits</b>
        </div>
        <div>
          <span>Missed</span>
          <b>13 habits</b>
        </div>
        <div>
          <span>Skipped</span>
          <b>13 habits</b>
        </div>
        <div>
          <span>New</span>
          <b>13 habits</b>
        </div>
      </section>
      <section className="sheet-reminder">
        <h3>Reminders</h3>
        <div>
          <b>4:00 AM</b>
          <span>Everyday</span>
          <small>Don't forget today's goals.</small>
          <i />
        </div>
      </section>
    </div>
  )
}

function CalendarOverlay({
  selectedDate,
  cells,
  onSelectDate,
  onReturnToday,
  onClose,
}: {
  selectedDate: string
  cells: CalendarCell[]
  onSelectDate: (date: string) => void
  onReturnToday: () => void
  onClose: () => void
}) {
  const isToday = selectedDate === 'today'
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [])

  return (
    <div className="calendar-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="calendar-top">
        <StatusBar />
        <div className="calendar-title-row">
          <button className="title-button" type="button">
            <span>{formatJuneDate(selectedDate)}</span>
            <Icon src={assets.chevron} size={12} />
          </button>
          <button className="calendar-close" type="button" onClick={onClose}>
            <Icon src={assets.close} />
          </button>
        </div>
      </div>
      <div className="calendar-fade" />
      <div className="calendar-body" ref={bodyRef}>
        <div className="calendar-month-stack">
          {[...pastCalendarMonths].reverse().map((month) => (
            <CalendarMonth key={month.title} title={month.title} cells={month.cells} />
          ))}
          {!isToday && (
            <button className="return-today calendar-return" type="button" onClick={onReturnToday}>
              <Icon src={assets.return} size={14} />
              <b>Return to today</b>
            </button>
          )}
          <CalendarMonth
            title="June"
            cells={cells}
            selectedDate={selectedDate}
            isToday={isToday}
            isCurrentMonth
            onSelectDate={onSelectDate}
          />
        </div>
      </div>
      <div className="pull-tab" />
    </div>
  )
}

function CalendarMonth({
  title,
  cells,
  selectedDate,
  isToday = false,
  isCurrentMonth = false,
  onSelectDate,
}: {
  title: string
  cells: CalendarCell[]
  selectedDate?: string
  isToday?: boolean
  isCurrentMonth?: boolean
  onSelectDate?: (date: string) => void
}) {
  return (
    <section className="calendar-month" aria-label={`${title} calendar`}>
      <h2>{title}</h2>
      <div className="calendar-grid header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <b key={day}>{day}</b>
        ))}
      </div>
      <div className="calendar-grid days">
        {cells.map((cell, index) => {
          if (!cell) return <span key={`blank-${index}`} className="blank outside-month" />

          const dayNumber = Number(cell.label)
          const isFuture = isCurrentMonth && dayNumber > 10
          const isSelected = isCurrentMonth && ((isToday && cell.label === '10') || selectedDate === cell.label)

          return (
            <button
              key={`${title}-${cell.label}-${index}`}
              type="button"
              className={`${isSelected ? 'selected' : ''} ${isFuture ? 'future' : ''}`}
              onClick={() => {
                if (isCurrentMonth && dayNumber <= 10) onSelectDate?.(cell.label === '10' ? 'today' : cell.label)
              }}
            >
              <span>{cell.label}</span>
              {!isFuture && <i style={{ backgroundColor: cell.color }} />}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function EditHabit({
  onBack,
  onSave,
}: {
  onBack: () => void
  onSave: () => void
}) {
  return (
    <main className="phone edit-screen">
      <StatusBar />
      <div className="edit-top">
        <button className="square" type="button" onClick={onBack}>
          <Icon src={assets.back} size={20} />
        </button>
        <h1>Edit Habit</h1>
        <button type="button" onClick={onSave}>Save</button>
      </div>
      <div className="edit-form">
        <FormSection title="Details">
          <div className="field full">Go Running</div>
          <div className="field-row">
            <div className="field split"><span>Icon</span><b>🏃‍♀️</b></div>
            <div className="field split"><span>Color</span><i /></div>
          </div>
        </FormSection>
        <FormSection title="Type">
          <div className="field type-field">
            <Icon src={assets.check} size={20} />
            <div>
              <b>Make</b>
              <span>Build a routine you want to do more often.</span>
            </div>
            <Icon src={assets.caret} size={16} />
          </div>
        </FormSection>
        <FormSection title="Goal">
          <div className="field-row">
            <div className="field">4</div>
            <div className="field split"><span>Times</span><Icon src={assets.caret} size={16} /></div>
          </div>
          <div className="schedule-card">
            <div className="schedule-head">
              <span>Daily</span>
              <Icon src={assets.caret} size={16} />
            </div>
            <div className="segment">
              <b>Daily</b>
              <b>Weekly</b>
              <b>Monthly</b>
            </div>
            <div className="weekday-pills">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <span key={`${day}-${index}`} className={index === 0 ? 'off' : ''}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </FormSection>
        <FormSection title="Time of day">
          <div className="time-row">
            {[
              ['🌈', 'All Day', true],
              ['🌅', 'Morning', false],
              ['☀️', 'Afternoon', false],
              ['🌙', 'Evening', false],
            ].map(([icon, label, active]) => (
              <div key={String(label)} className={active ? 'active' : ''}>
                <span>{icon}</span>
                <b>{label}</b>
              </div>
            ))}
          </div>
        </FormSection>
        <FormSection title="Reminders">
          <div className="field split muted">
            <span>Create custom reminder</span>
            <Icon src={assets.bell} size={20} />
          </div>
        </FormSection>
        <div className="date-row">
          <FormSection title="Start Date">
            <div className="field split"><span>Today</span><Icon src={assets.date} size={20} /></div>
          </FormSection>
          <FormSection title="End Date">
            <div className="field split"><span>Never</span><Icon src={assets.date} size={20} /></div>
          </FormSection>
        </div>
      </div>
    </main>
  )
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="form-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function CreateShell({
  step,
  children,
  onBack,
  onExit,
  progress,
}: {
  step: CreateStep
  children: ReactNode
  onBack?: () => void
  onExit?: () => void
  progress?: number
}) {
  if (step === 'start' || step === 'templates') {
    return (
      <main className="phone create-screen">
        <StatusBar />
        {children}
      </main>
    )
  }

  return (
    <main className="phone create-screen">
      <div className="create-header" />
      <StatusBar />
      <div className="create-upper">
        {onBack && (
          <button className="create-square" type="button" onClick={onBack} aria-label="Back">
            <span className="back-rotator">
              <Icon src={assets.createBack} />
            </span>
          </button>
        )}
        {onExit && (
          <button className="create-square" type="button" onClick={onExit} aria-label="Close">
            <Icon src={assets.createClose} />
          </button>
        )}
      </div>
      {typeof progress === 'number' && (
        <div className="create-progress">
          <span style={{ width: `${Math.max(0, Math.min(progress, 1)) * 257}px` }} />
        </div>
      )}
      {children}
    </main>
  )
}

function CreateBottomButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`create-bottom ${disabled ? 'disabled' : ''}`}
      type="button"
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

function CategoryButton({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick: () => void
}) {
  return (
    <button className="category-card" type="button" onClick={onClick}>
      <span className="category-emoji">{icon}</span>
      <b>{label}</b>
      <Icon src={assets.createCaret} size={18} />
    </button>
  )
}

function CreateStart({
  habitName,
  onName,
  onTemplates,
  onNext,
  onHome,
}: {
  habitName: string
  onName: (name: string) => void
  onTemplates: () => void
  onNext: () => void
  onHome: () => void
}) {
  const hasTyped = habitName.trim().length > 0
  return (
    <CreateShell step="start">
      <div className="create-start-content">
        <h1>What should we call your new habit?</h1>
        <div className={`create-name-input ${hasTyped ? 'typing' : ''}`}>
          <input
            value={habitName}
            placeholder="Habit name"
            onChange={(event) => onName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && hasTyped) onNext()
            }}
          />
          {hasTyped && (
            <button type="button" onClick={onNext} aria-label="Continue">
              <Icon src={assets.createCaret} size={18} />
            </button>
          )}
        </div>
      </div>
      <section className="categories-block">
        <h2>Categories</h2>
        <div className="category-grid">
          {categoryItems.map(([icon, label]) => (
            <CategoryButton key={label} icon={icon} label={label} onClick={onTemplates} />
          ))}
        </div>
      </section>
      {hasTyped && <KeyboardOverlay />}
      <BottomNav showLabels active="new" onHome={onHome} onNew={() => undefined} />
    </CreateShell>
  )
}

function TemplateList({
  onBack,
  onPick,
  onHome,
}: {
  onBack: () => void
  onPick: () => void
  onHome: () => void
}) {
  return (
    <CreateShell step="templates">
      <div className="template-top">
        <button className="create-square" type="button" onClick={onBack}>
          <span className="back-rotator">
            <Icon src={assets.createBack} />
          </span>
        </button>
        <h1>Fitness</h1>
      </div>
      <div className="template-list">
        {templateSections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <div className="category-grid">
              {section.items.map(([icon, label]) => (
                <CategoryButton key={`${section.title}-${label}`} icon={icon} label={label} onClick={onPick} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <BottomNav showLabels active="new" onHome={onHome} onNew={() => undefined} />
    </CreateShell>
  )
}

function TypeChoice({
  icon,
  title,
  copy,
  active,
  onClick,
}: {
  icon: string
  title: Habit['type']
  copy: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button className={`type-choice ${active ? 'active' : ''}`} type="button" onClick={onClick}>
      <Icon src={icon} size={24} />
      <span>
        <b>{title}</b>
        <small>{copy}</small>
      </span>
      {active && <Icon src={assets.createCaret} size={16} />}
    </button>
  )
}

function CreateDetails({
  draft,
  onDraft,
  onBack,
  onExit,
  onNext,
}: {
  draft: CreateDraft
  onDraft: (draft: CreateDraft) => void
  onBack: () => void
  onExit: () => void
  onNext: () => void
}) {
  const [overlay, setOverlay] = useState<'emoji' | 'color' | null>(null)
  const [typeOpen, setTypeOpen] = useState(false)

  return (
    <CreateShell step="details" onBack={onBack} onExit={onExit} progress={1 / 3}>
      <h1 className="create-title">Does this look right?</h1>
      <div className="create-form details-form">
        <FormSection title="Details">
          <input
            className="field full plain-input"
            value={draft.name}
            onChange={(event) => onDraft({ ...draft, name: event.target.value })}
          />
          <div className="field-row">
            <button className="field split detail-click" type="button" onClick={() => setOverlay('emoji')}>
              <span>Icon</span>
              <b>{draft.icon}</b>
            </button>
            <button className="field split detail-click" type="button" onClick={() => setOverlay('color')}>
              <span>Color</span>
              <i style={{ background: draft.color }} />
            </button>
          </div>
        </FormSection>
        <FormSection title="Type">
          <div className={`type-stack ${typeOpen ? 'open' : ''}`}>
            <TypeChoice
              icon={assets.createPin}
              title="Make"
              copy="Build a routine you want to do more often."
              active={draft.type === 'Make'}
              onClick={() => {
                onDraft({ ...draft, type: 'Make' })
                setTypeOpen(!typeOpen)
              }}
            />
            {typeOpen && (
              <>
                <TypeChoice
                  icon={assets.createHourglass}
                  title="Limit"
                  copy="Set a cap for something you want less of."
                  active={draft.type === 'Limit'}
                  onClick={() => onDraft({ ...draft, type: 'Limit' })}
                />
                <TypeChoice
                  icon={assets.createBreak}
                  title="Break"
                  copy="Stop a routine that keeps showing up."
                  active={draft.type === 'Break'}
                  onClick={() => onDraft({ ...draft, type: 'Break' })}
                />
              </>
            )}
          </div>
        </FormSection>
      </div>
      {overlay === 'emoji' && (
        <div className="popup-dismiss-layer" onClick={() => setOverlay(null)}>
          <EmojiOverlay
            onPick={(icon) => {
              onDraft({ ...draft, icon })
              setOverlay(null)
            }}
            onClose={() => setOverlay(null)}
          />
        </div>
      )}
      {overlay === 'color' && (
        <ColorOverlay
          selected={draft.color}
          onPick={(color) => {
            onDraft({ ...draft, color })
            setOverlay(null)
          }}
          onClose={() => setOverlay(null)}
        />
      )}
      <CreateBottomButton onClick={onNext}>Next</CreateBottomButton>
    </CreateShell>
  )
}

function KeyboardOverlay() {
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  return (
    <div className="keyboard-overlay" aria-hidden="true">
      <div className="keyboard-bar">English (US)</div>
      <div className="keyboard-keys">
        {rows.map((row) => (
          <div key={row} className={`keyboard-row row-${row.length}`}>
            {row.split('').map((letter) => (
              <span key={letter}>{letter}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="keyboard-actions">
        <span>123</span>
        <b>space</b>
        <strong>return</strong>
      </div>
    </div>
  )
}

function EmojiOverlay({
  onPick,
  onClose,
}: {
  onPick: (icon: string) => void
  onClose: () => void
}) {
  const icons = [
    '\u{1F600}', '\u{1F603}', '\u{1F604}', '\u{1F601}', '\u{1F606}', '\u{1F605}', '\u{1F923}', '\u{1F602}',
    '\u{1F642}', '\u{1F643}', '\u{1F609}', '\u{1F60A}', '\u{1F607}', '\u{1F970}', '\u{1F60D}', '\u{1F929}',
    '\u{1F618}', '\u{1F617}', '\u{1F61A}', '\u{1F619}', '\u{1F60B}', '\u{1F61B}', '\u{1F61C}', '\u{1F92A}',
    '\u{1F61D}', '\u{1F911}', '\u{1F917}', '\u{1F92D}', '\u{1F92B}', '\u{1F914}', '\u{1F910}', '\u{1F928}',
    '\u{1F610}', '\u{1F611}', '\u{1F636}', '\u{1F60F}', '\u{1F612}', '\u{1F644}', '\u{1F62C}', '\u{1F925}',
    '\u{1F60C}', '\u{1F614}', '\u{1F62A}', '\u{1F924}', '\u{1F634}', '\u{1F637}', '\u{1F912}', runningIcon,
  ]

  return (
    <div className="emoji-panel" onClick={(event) => event.stopPropagation()}>
      <button className="emoji-search" type="button" onClick={onClose}>Search Emoji</button>
      <h2>SMILES &amp; PEOPLES</h2>
      <div>
        {icons.map((icon) => (
          <button key={icon} type="button" onClick={() => onPick(icon)}>
            {icon}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorOverlay({
  selected,
  onPick,
  onClose,
}: {
  selected: string
  onPick: (color: string) => void
  onClose: () => void
}) {
  return (
    <div className="color-scrim" onClick={onClose}>
      <div className="palette-card" onClick={(event) => event.stopPropagation()}>
        {paletteColors.map((color) => (
          <button key={color} type="button" onClick={() => onPick(color)}>
            {color === '#f6f7fa' ? (
              <Icon src={assets.colorPicked} size={32} />
            ) : (
              <span style={{ background: color }} />
            )}
            {selected === color && <i />}
          </button>
        ))}
      </div>
    </div>
  )
}

function GoalStep({
  draft,
  onDraft,
  onBack,
  onExit,
  onNext,
}: {
  draft: CreateDraft
  onDraft: (draft: CreateDraft) => void
  onBack: () => void
  onExit: () => void
  onNext: () => void
}) {
  const [unitOpen, setUnitOpen] = useState(false)
  const [frequencyOpen, setFrequencyOpen] = useState(false)
  const complete = draft.goal > 0 && draft.unit.length > 0

  return (
    <CreateShell step="goal" onBack={onBack} onExit={onExit} progress={2 / 3}>
      <h1 className="create-title">What is your habit goal?</h1>
      <div className="create-form goal-form">
        <FormSection title="Goal">
          <div className="field-row goal-row">
            <input
              className="field plain-input"
              value={draft.goal || ''}
              inputMode="numeric"
              placeholder="Quantity"
              onChange={(event) => onDraft({ ...draft, goal: Number(event.target.value) || 0 })}
            />
            <button className="field split detail-click" type="button" onClick={() => setUnitOpen(true)}>
              <span className={draft.unit ? '' : 'placeholder'}>{draft.unit || 'Unit'}</span>
              <Icon src={assets.createCaret} size={16} />
            </button>
          </div>
          <div className={`schedule-card ${frequencyOpen ? 'create-expanded' : ''}`}>
            <button className="schedule-head" type="button" onClick={() => setFrequencyOpen(!frequencyOpen)}>
              <span>{draft.frequency}</span>
              <Icon src={assets.createCaret} size={16} />
            </button>
            {frequencyOpen && (
              <>
                <div className="segment">
                  {(['Daily', 'Weekly', 'Monthly'] as Frequency[]).map((item) => (
                    <button
                      key={item}
                      className={draft.frequency === item ? 'selected' : ''}
                      type="button"
                      onClick={() => onDraft({ ...draft, frequency: item })}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {draft.frequency === 'Daily' ? (
                  <div className="weekday-pills">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                      const key = index === 4 ? 'T2' : day
                      const active = draft.activeDays.includes(key)
                      return (
                        <button
                          key={`${day}-${index}`}
                          className={active ? '' : 'off'}
                          type="button"
                          onClick={() =>
                            onDraft({
                              ...draft,
                              activeDays: active
                                ? draft.activeDays.filter((item) => item !== key)
                                : [...draft.activeDays, key],
                            })
                          }
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="every-field">Every <input value="1" readOnly /> {draft.frequency === 'Weekly' ? 'week' : 'month'}</div>
                )}
              </>
            )}
          </div>
        </FormSection>
      </div>
      {unitOpen && (
        <div className="popup-dismiss-layer" onClick={() => setUnitOpen(false)}>
          <UnitDrawer
            onPick={(unit) => {
              onDraft({ ...draft, unit })
              setUnitOpen(false)
            }}
            onClose={() => setUnitOpen(false)}
          />
        </div>
      )}
      <CreateBottomButton disabled={!complete} onClick={onNext}>Next</CreateBottomButton>
    </CreateShell>
  )
}

function UnitDrawer({
  onPick,
  onClose,
}: {
  onPick: (unit: string) => void
  onClose: () => void
}) {
  return (
    <div className="unit-drawer" onClick={(event) => event.stopPropagation()}>
      <button className="sheet-handle" type="button" onClick={onClose} aria-label="Close unit list" />
      <h2>Unit Type</h2>
      <div>
        {unitOptions.map((unit) => (
          <button key={unit} type="button" onClick={() => onPick(unit)}>
            {unit}
          </button>
        ))}
      </div>
    </div>
  )
}

function TimeOptions({
  selected,
  onSelect,
}: {
  selected?: HomeTab
  onSelect: (tab: HomeTab) => void
}) {
  const options: Array<[string, HomeTab]> = [
    ['\u{1F308}', 'All Day'],
    ['\u{1F305}', 'Morning'],
    ['\u2600\uFE0F', 'Afternoon'],
    ['\u{1F319}', 'Evening'],
  ]

  return (
    <div className="time-row">
      {options.map(([icon, label]) => (
        <button
          key={label}
          className={selected === label ? 'active' : ''}
          type="button"
          onClick={() => onSelect(label)}
        >
          <span>{icon}</span>
          <b>{label}</b>
        </button>
      ))}
    </div>
  )
}

function TimeStep({
  draft,
  picked,
  onPick,
  onBack,
  onExit,
  onNext,
}: {
  draft: CreateDraft
  picked: boolean
  onPick: (tab: HomeTab) => void
  onBack: () => void
  onExit: () => void
  onNext: () => void
}) {
  return (
    <CreateShell step="time" onBack={onBack} onExit={onExit} progress={5 / 6}>
      <h1 className="create-title time-title">What time of day should this be completed?</h1>
      <div className="create-form time-form">
        <FormSection title="Goal">
          <div className="field-row goal-row">
            <div className="field">{draft.goal}</div>
            <div className="field split">
              <span>{draft.unit}</span>
              <Icon src={assets.createCaret} size={16} />
            </div>
          </div>
          <div className="schedule-card collapsed">
            <div className="schedule-head">
              <span>{draft.frequency}</span>
              <Icon src={assets.createCaret} size={16} />
            </div>
          </div>
        </FormSection>
        <FormSection title="Time of day">
          <TimeOptions selected={picked ? draft.timeOfDay : undefined} onSelect={onPick} />
        </FormSection>
      </div>
      <CreateBottomButton disabled={!picked} onClick={onNext}>Next</CreateBottomButton>
    </CreateShell>
  )
}

function ReviewStep({
  draft,
  onExit,
  onCreate,
}: {
  draft: CreateDraft
  onExit: () => void
  onCreate: () => void
}) {
  return (
    <main className="phone edit-screen create-review">
      <div className="create-header" />
      <StatusBar />
      <div className="edit-top review-top">
        <h1>Edit Habit</h1>
        <button className="create-square" type="button" onClick={onExit} aria-label="Close">
          <Icon src={assets.createClose} />
        </button>
      </div>
      <div className="edit-form">
        <FormSection title="Details">
          <div className="field full">{draft.name}</div>
          <div className="field-row">
            <div className="field split"><span>Icon</span><b>{draft.icon}</b></div>
            <div className="field split"><span>Color</span><i style={{ background: draft.color }} /></div>
          </div>
        </FormSection>
        <FormSection title="Type">
          <div className="field type-field">
            <Icon src={assets.createPin} size={20} />
            <div>
              <b>{draft.type}</b>
              <span>Build a routine you want to do more often.</span>
            </div>
            <Icon src={assets.createCaret} size={16} />
          </div>
        </FormSection>
        <FormSection title="Goal">
          <div className="field-row">
            <div className="field">{draft.goal}</div>
            <div className="field split"><span>{draft.unit}</span><Icon src={assets.createCaret} size={16} /></div>
          </div>
          <div className="schedule-card create-expanded">
            <div className="schedule-head">
              <span>{draft.frequency}</span>
              <Icon src={assets.createCaret} size={16} />
            </div>
            <div className="segment">
              {(['Daily', 'Weekly', 'Monthly'] as Frequency[]).map((item) => (
                <b key={item} className={draft.frequency === item ? 'selected' : ''}>{item}</b>
              ))}
            </div>
            <div className="weekday-pills">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                const key = index === 4 ? 'T2' : day
                return (
                  <span key={`${day}-${index}`} className={draft.activeDays.includes(key) ? '' : 'off'}>
                    {day}
                  </span>
                )
              })}
            </div>
          </div>
        </FormSection>
        <FormSection title="Time of day">
          <TimeOptions selected={draft.timeOfDay} onSelect={() => undefined} />
        </FormSection>
        <FormSection title="Reminders">
          <div className="field split muted">
            <span>Create custom reminder</span>
            <Icon src={assets.bell} size={20} />
          </div>
        </FormSection>
        <div className="date-row">
          <FormSection title="Start Date">
            <div className="field split"><span>Today</span><Icon src={assets.date} size={20} /></div>
          </FormSection>
          <FormSection title="End Date">
            <div className="field split"><span>Never</span><Icon src={assets.date} size={20} /></div>
          </FormSection>
        </div>
      </div>
      <CreateBottomButton onClick={onCreate}>Create Habit</CreateBottomButton>
    </main>
  )
}

function CreateHabitFlow({
  onHome,
  onComplete,
}: {
  onHome: () => void
  onComplete: (habit: Habit) => void
}) {
  const emptyCustomHabit: CreateDraft = { ...defaultRunningHabit, goal: 0, unit: '', timeOfDay: 'All Day' }
  const [step, setStep] = useState<CreateStep>('start')
  const [habitName, setHabitName] = useState('')
  const [draft, setDraft] = useState<CreateDraft>(emptyCustomHabit)
  const [timePicked, setTimePicked] = useState(false)

  const resetToStart = () => {
    setStep('start')
    setHabitName('')
    setDraft(emptyCustomHabit)
    setTimePicked(false)
  }

  const startCustom = () => {
    setDraft({ ...emptyCustomHabit, name: habitName.trim() || defaultRunningHabit.name })
    setStep('details')
  }

  const chooseTemplate = () => {
    setDraft(defaultRunningHabit)
    setTimePicked(true)
    setStep('review')
  }

  if (step === 'templates') {
    return <TemplateList onBack={resetToStart} onPick={chooseTemplate} onHome={onHome} />
  }

  if (step === 'details') {
    return (
      <CreateDetails
        draft={draft}
        onDraft={setDraft}
        onBack={resetToStart}
        onExit={resetToStart}
        onNext={() => setStep('goal')}
      />
    )
  }

  if (step === 'goal') {
    return (
      <GoalStep
        draft={draft}
        onDraft={setDraft}
        onBack={() => setStep('details')}
        onExit={resetToStart}
        onNext={() => setStep('time')}
      />
    )
  }

  if (step === 'time') {
    return (
      <TimeStep
        draft={draft}
        picked={timePicked}
        onPick={(tab) => {
          setDraft({ ...draft, timeOfDay: tab })
          setTimePicked(true)
        }}
        onBack={() => setStep('goal')}
        onExit={resetToStart}
        onNext={() => setStep('review')}
      />
    )
  }

  if (step === 'review') {
    return (
      <ReviewStep
        draft={draft}
        onExit={resetToStart}
        onCreate={() => onComplete({ ...draft, goal: draft.goal || 4, unit: draft.unit || 'Miles' })}
      />
    )
  }

  return (
    <CreateStart
      habitName={habitName}
      onName={setHabitName}
      onTemplates={() => setStep('templates')}
      onNext={startCustom}
      onHome={onHome}
    />
  )
}

function App() {
  const [view, setView] = useState<View>('home')
  const [hasHabit, setHasHabit] = useState(true)
  const [habit, setHabit] = useState<Habit>(defaultRunningHabit)
  const [activeHomeTab, setActiveHomeTab] = useState<HomeTab>('All Day')
  const [habitOpen, setHabitOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('today')
  const [juneProgressByDate, setJuneProgressByDate] = useState<JuneProgressByDate>(initialJuneProgressByDate)

  const selectedJuneDate = selectedDate === 'today' ? habitDayToJuneDate[todayHabitDay] : selectedDate
  const selectedHabitDay = juneDateToHabitDay[selectedJuneDate] ?? todayHabitDay
  const progressByDay = useMemo<Record<HabitDay, number>>(() => ({
    Th: juneProgressByDate[habitDayToJuneDate.Th] ?? 0,
    Fr: juneProgressByDate[habitDayToJuneDate.Fr] ?? 0,
    Sa: juneProgressByDate[habitDayToJuneDate.Sa] ?? 0,
    Su: juneProgressByDate[habitDayToJuneDate.Su] ?? 0,
    Mo: juneProgressByDate[habitDayToJuneDate.Mo] ?? 0,
    Tu: juneProgressByDate[habitDayToJuneDate.Tu] ?? 0,
    We: juneProgressByDate[habitDayToJuneDate.We] ?? 0,
  }), [juneProgressByDate])
  const juneCalendarCells = useMemo<CalendarCell[]>(
    () => monthCells.map((cell) => (
      cell
        ? { ...cell, color: calendarColorForProgressValue(juneProgressByDate[cell.label] ?? 0, habit.goal) }
        : null
    )),
    [habit.goal, juneProgressByDate],
  )
  const currentValue = progressByDay[selectedHabitDay]
  const homeHabitValue = juneProgressByDate[selectedJuneDate] ?? 0
  const homeStreak = selectedDate === 'today' && homeHabitValue >= habit.goal ? 1 : 0
  const headerTitle = formatJuneDate(selectedDate)
  const habitVisible = hasHabit && habit.timeOfDay === activeHomeTab

  const setJuneProgress = useCallback((date: string, value: number) => {
    setJuneProgressByDate((next) => ({
      ...next,
      [date]: Math.max(0, Math.min(value, habit.goal)),
    }))
  }, [habit.goal])

  const selectHabitDay = useCallback((day: HabitDay) => {
    const date = habitDayToJuneDate[day]
    setSelectedDate(day === todayHabitDay ? 'today' : date)
  }, [])

  const removeHabit = () => {
    setHasHabit(false)
    setHabitOpen(false)
    setCalendarOpen(false)
    setView('home')
  }

  const home = useMemo(
    () => (
      <main className="phone home-screen">
        <TopBar
          title={headerTitle}
          activeTab={activeHomeTab}
          onTab={setActiveHomeTab}
          onCalendar={() => setCalendarOpen(true)}
        />
        {habitVisible ? (
          <HabitRow
            hasHabit
            habit={habit}
            value={homeHabitValue}
            streak={homeStreak}
            onOpen={() => setHabitOpen(true)}
            onIncrement={() => setJuneProgress(selectedJuneDate, homeHabitValue + 1)}
          />
        ) : (
          <>
            <HabitRow
              hasHabit={false}
              habit={defaultRunningHabit}
              value={0}
              streak={0}
              onOpen={() => undefined}
              onIncrement={() => undefined}
            />
            <HomeEmpty />
          </>
        )}
        <BottomNav
          showLabels
          active="home"
          onHome={() => setView('home')}
          onNew={() => setView('new')}
        />
        {habitOpen && habitVisible && (
          <div className="overlay-click-layer habit-layer" onClick={() => setHabitOpen(false)}>
            <HabitSheet
              habit={habit}
              day={selectedHabitDay}
              value={currentValue}
              onDay={selectHabitDay}
              onToday={() => selectHabitDay(todayHabitDay)}
              onClose={() => setHabitOpen(false)}
              onValue={(value) =>
                setJuneProgress(habitDayToJuneDate[selectedHabitDay], value)
              }
              onEdit={() => setView('edit')}
              onArchive={removeHabit}
            onDelete={removeHabit}
              progressByDay={progressByDay}
            />
          </div>
        )}
        {calendarOpen && (
          <div className="overlay-click-layer calendar-layer" onClick={() => setCalendarOpen(false)}>
            <CalendarOverlay
              selectedDate={selectedDate}
              cells={juneCalendarCells}
              onSelectDate={setSelectedDate}
              onReturnToday={() => setSelectedDate('today')}
              onClose={() => setCalendarOpen(false)}
            />
          </div>
        )}
      </main>
    ),
    [
      calendarOpen,
      currentValue,
      habitOpen,
      homeHabitValue,
      homeStreak,
      habit,
      habitVisible,
      headerTitle,
      activeHomeTab,
      progressByDay,
      juneCalendarCells,
      selectHabitDay,
      selectedJuneDate,
      selectedDate,
      selectedHabitDay,
      setJuneProgress,
    ],
  )

  if (view === 'edit') {
    return <EditHabit onBack={() => setView('home')} onSave={() => setView('home')} />
  }

  if (view === 'new') {
    return (
      <CreateHabitFlow
        onHome={() => setView('home')}
        onComplete={(createdHabit) => {
          setHabit(createdHabit)
          setHasHabit(true)
          setHabitOpen(false)
          setCalendarOpen(false)
          setActiveHomeTab(createdHabit.timeOfDay)
          setJuneProgressByDate({})
          setView('home')
        }}
      />
    )
  }

  return home
}

export default App
