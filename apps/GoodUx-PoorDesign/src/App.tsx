import { useMemo, useState, type ReactNode } from 'react'
import './App.css'

const assets = {
  sort: 'https://www.figma.com/api/mcp/asset/35799534-e068-4093-96ab-bf6b7bd87bad',
  chevron: 'https://www.figma.com/api/mcp/asset/9ce95dc9-24b0-4cf0-913c-599adbbbd79b',
  profile: 'https://www.figma.com/api/mcp/asset/79ff06a8-6b78-465e-a595-e122a33e92c4',
  home: 'https://www.figma.com/api/mcp/asset/53a9bcf5-852a-46c8-9581-40e97e4bea4a',
  addOutline: 'https://www.figma.com/api/mcp/asset/25a0e9b2-9999-4b58-af2e-205fb03aa6ab',
  stats: 'https://www.figma.com/api/mcp/asset/6619e595-4045-4f70-917a-11e1a7f55cc3',
  plus: 'https://www.figma.com/api/mcp/asset/e1e511ce-94f4-4a0f-9ad2-97d30110b524',
  close: 'https://www.figma.com/api/mcp/asset/e003d2ff-0655-444c-a370-62092a2d352d',
  pencil: 'https://www.figma.com/api/mcp/asset/85dbab40-caf5-4b06-8143-c2cb6f64c9ce',
  redo: 'https://www.figma.com/api/mcp/asset/e0dd13a4-564b-4081-b032-e2004bbab403',
  archive: 'https://www.figma.com/api/mcp/asset/a695d724-a9ce-4387-8388-450c555dead6',
  trash: 'https://www.figma.com/api/mcp/asset/11eaa9da-9b0d-4a77-9e7b-ca93e506a90f',
  return: 'https://www.figma.com/api/mcp/asset/fdeb73b5-d028-4abf-a97f-d87ef28e733c',
  back: 'https://www.figma.com/api/mcp/asset/91bf38f1-00f0-438f-9c68-ace7b74b9928',
  caret: 'https://www.figma.com/api/mcp/asset/683ae353-1ebb-4567-9146-088f598a17bb',
  check: 'https://www.figma.com/api/mcp/asset/1aeb004d-c283-4d53-bdf3-3bb39b682e17',
  bell: 'https://www.figma.com/api/mcp/asset/cb7848fa-61cc-4945-bafc-559f0e013d60',
  date: 'https://www.figma.com/api/mcp/asset/7af3df8f-fde0-4ebb-b3da-aca24453e52f',
  createBack: 'https://www.figma.com/api/mcp/asset/a808bc85-b97a-40a2-b26b-6672f10c63d8',
  createClose: 'https://www.figma.com/api/mcp/asset/f38205f7-78d6-4588-8694-f190a02c3d38',
  createCaret: 'https://www.figma.com/api/mcp/asset/10819c92-481d-46dd-b59e-bf007c86ee98',
  createPin: 'https://www.figma.com/api/mcp/asset/9ff4bc4c-786f-4fd1-9c8b-d6232226287d',
  createHourglass: 'https://www.figma.com/api/mcp/asset/e21d7da3-abf1-4b4e-b3f9-a756a41322fd',
  createBreak: 'https://www.figma.com/api/mcp/asset/489723c9-6cab-4db8-9521-1307e8962d47',
  colorPicked: 'https://www.figma.com/api/mcp/asset/b8005534-c275-4556-87a9-dc346a2ac4e7',
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
const todayHabitDay: HabitDay = 'Mo'
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

const monthCells = [
  null,
  null,
  null,
  null,
  null,
  { label: '1', color: '#97da90' },
  { label: '2', color: '#e4e7d2' },
  { label: '3', color: '#e4e7d2' },
  { label: '4', color: '#005d8f' },
  { label: '5', color: '#005d8f' },
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
  null,
  null,
  null,
  null,
  null,
  null,
]

function polarToCartesian(size: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: size / 2 + (size / 2 - 5) * Math.cos(radians),
    y: size / 2 + (size / 2 - 5) * Math.sin(radians),
  }
}

function arcPath(size: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(size, endAngle)
  const end = polarToCartesian(size, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${size / 2 - 5} ${size / 2 - 5} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

function ProgressArc({
  value,
  goal,
  size,
  className = '',
}: {
  value: number
  goal: number
  size: number
  className?: string
}) {
  const start = 126
  const sweep = 272
  const progress = Math.max(0, Math.min(value / goal, 1))
  return (
    <svg
      className={`progress-arc ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      <path d={arcPath(size, start, start + sweep)} className="arc-track" />
      <path
        d={arcPath(size, start, start + sweep * progress)}
        className="arc-fill"
      />
    </svg>
  )
}

function Icon({ src, size = 24 }: { src: string; size?: number }) {
  return <img alt="" src={src} style={{ width: size, height: size }} />
}

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <span className="status-island" />
      <span className="status-icons">▰ ◔</span>
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
        {showLabels && <span>Home</span>}
      </button>
      <button className={`nav-item ${active === 'new' ? 'active' : ''}`} type="button" onClick={onNew}>
        <span className="nav-box">
          <Icon src={assets.addOutline} size={32} />
        </span>
        {showLabels && <span>New</span>}
      </button>
      <button className={`nav-item ${active === 'progress' ? 'active' : ''}`} type="button">
        <span className="nav-box">
          <Icon src={assets.stats} size={32} />
        </span>
        {showLabels && <span>Progress</span>}
      </button>
    </nav>
  )
}

function HabitRow({
  hasHabit,
  habit,
  value,
  onOpen,
  onIncrement,
}: {
  hasHabit: boolean
  habit: Habit
  value: number
  onOpen: () => void
  onIncrement: () => void
}) {
  const title = hasHabit ? habit.name : 'Make a new habit'
  const amount = hasHabit ? `${value}/${habit.goal} ${habit.unit}` : '0/4 Miles'
  return (
    <div className={`habit-list ${hasHabit ? 'seeded' : 'empty-seed'}`}>
      <button className="habit-row" type="button" onClick={hasHabit ? onOpen : undefined}>
        <div className="small-ring">
          <ProgressArc value={hasHabit ? value : 0} goal={habit.goal} size={64} />
          <span className="habit-icon">{hasHabit ? habit.icon : clipboardIcon}</span>
          <span>{hasHabit ? '🏃‍♀️' : '📋️'}</span>
        </div>
        <div className="habit-copy">
          <b>{title}</b>
          <strong>{amount}</strong>
        </div>
        {hasHabit && (
          <div className="streak">
            <div>
              <b>12</b>
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
    <div className="habit-menu">
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
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="habit-sheet">
      <button className="sheet-handle" type="button" onClick={onClose} aria-label="Close habit" />
      <div className="sheet-title">
        <div>
          <h2>{habit.name}</h2>
          <p className="sheet-meta">{habit.frequency} <span>•</span> {habit.timeOfDay}</p>
          <p>Daily <span>•</span> All Day</p>
        </div>
        <button className="sheet-dots" type="button" onClick={() => setMenuOpen(!menuOpen)}>
          <span>⋮</span>
        </button>
        {menuOpen && (
          <HabitMenu onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} />
        )}
      </div>
      <div className="sheet-progress">
        <div className="large-ring">
          <ProgressArc value={value} goal={habit.goal} size={200} />
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
          <button
            key={item}
            className={item === day ? 'selected' : ''}
            type="button"
            onClick={() => onDay(item)}
          >
            <span className={`day-fill fill-${item.toLowerCase()}`} />
            <b>{item}</b>
          </button>
        ))}
      </div>
      {day !== todayHabitDay && (
        <button className="return-today sheet-return" type="button" onClick={onToday}>
          <span className="return-icon">↩</span>
          <b>Return to today</b>
        </button>
      )}
      <section className="sheet-section no-op">
        <h3>Last 30 days</h3>
        <div className="github-grid">
          {Array.from({ length: 84 }, (_, index) => (
            <span key={index} className={`heat-${index % 4}`} />
          ))}
        </div>
      </section>
      <section className="sheet-stats no-op">
        <div>
          <b>75%</b>
          <span>Monthly completion rate</span>
        </div>
        <div>
          <b>12</b>
          <span>day streak</span>
        </div>
      </section>
    </div>
  )
}

function CalendarOverlay({
  selectedDate,
  onSelectDate,
  onReturnToday,
  onClose,
}: {
  selectedDate: string
  onSelectDate: (date: string) => void
  onReturnToday: () => void
  onClose: () => void
}) {
  const isToday = selectedDate === 'today'
  return (
    <div className="calendar-overlay">
      <div className="calendar-top">
        <StatusBar />
        <div className="calendar-title-row">
          <button className="title-button" type="button">
            <span>{isToday ? 'Today' : 'June 8th'}</span>
            <Icon src={assets.chevron} size={12} />
          </button>
          <button className="calendar-close" type="button" onClick={onClose}>
            <Icon src={assets.close} />
          </button>
        </div>
      </div>
      <div className="calendar-fade" />
      <div className="calendar-body">
        <h2>May</h2>
        <div className="calendar-grid header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <b key={day}>{day}</b>
          ))}
        </div>
        <div className="calendar-grid days">
          {monthCells.map((cell, index) =>
            cell ? (
              <button
                key={`${cell.label}-${index}`}
                type="button"
                className={`${selectedDate === cell.label ? 'selected' : ''} ${
                  Number(cell.label) > 10 ? 'future' : ''
                }`}
                onClick={() => Number(cell.label) <= 10 && onSelectDate(cell.label)}
              >
                <span>{cell.label}</span>
                {Number(cell.label) <= 10 && (
                  <i style={{ backgroundColor: cell.color }} />
                )}
              </button>
            ) : (
              <span key={`blank-${index}`} className="blank" />
            ),
          )}
        </div>
        {!isToday && (
          <button className="return-today calendar-return" type="button" onClick={onReturnToday}>
            <Icon src={assets.return} size={14} />
            <b>Return to today</b>
          </button>
        )}
      </div>
      <div className="pull-tab" />
    </div>
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
      <BottomNav showLabels={hasTyped} active="new" onHome={onHome} onNew={() => undefined} />
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
        <EmojiOverlay
          onPick={(icon) => {
            onDraft({ ...draft, icon })
            setOverlay(null)
          }}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === 'color' && (
        <ColorOverlay
          selected={draft.color}
          onPick={(color) => {
            onDraft({ ...draft, color })
            setOverlay(null)
          }}
        />
      )}
      <CreateBottomButton onClick={onNext}>Next</CreateBottomButton>
    </CreateShell>
  )
}

function KeyboardOverlay() {
  return (
    <div className="keyboard-overlay" aria-hidden="true">
      <div className="keyboard-bar">English (US)</div>
      <div className="keyboard-keys">
        {'qwertyuiopasdfghjklzxcvbnm'.split('').map((letter) => (
          <span key={letter}>{letter}</span>
        ))}
      </div>
      <div className="keyboard-space">space</div>
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
    runningIcon,
    '\u{1F6B6}',
    '\u{1F6B2}',
    '\u{1F3CA}\u200D\u2640\uFE0F',
    '\u{1F3C0}',
    '\u{1F4AA}',
    '\u{1F4DA}',
    '\u{1F331}',
    '\u{1F4B5}',
    '\u{1F6CF}\uFE0F',
    '\u{1F514}',
    '\u{1F4A7}',
  ]

  return (
    <div className="emoji-panel">
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
}: {
  selected: string
  onPick: (color: string) => void
}) {
  return (
    <div className="color-scrim">
      <div className="palette-card">
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
        <UnitDrawer
          onPick={(unit) => {
            onDraft({ ...draft, unit })
            setUnitOpen(false)
          }}
          onClose={() => setUnitOpen(false)}
        />
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
    <div className="unit-drawer">
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
  const [selectedHabitDay, setSelectedHabitDay] = useState<HabitDay>(todayHabitDay)
  const [progressByDay, setProgressByDay] = useState<Record<HabitDay, number>>({
    Th: 1,
    Fr: 1,
    Sa: 0,
    Su: 2,
    Mo: 2,
    Tu: 2,
    We: 0,
  })

  const currentValue = progressByDay[selectedHabitDay]
  const headerTitle = selectedDate === 'today' ? 'Today' : 'June 8th'
  const habitVisible = hasHabit && habit.timeOfDay === activeHomeTab

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
            value={progressByDay.Mo}
            onOpen={() => setHabitOpen(true)}
            onIncrement={() =>
              setProgressByDay((next) => ({
                ...next,
                Mo: Math.min(habit.goal, next.Mo + 1),
              }))
            }
          />
        ) : (
          <>
            <HabitRow
              hasHabit={false}
              habit={defaultRunningHabit}
              value={0}
              onOpen={() => undefined}
              onIncrement={() => undefined}
            />
            <HomeEmpty />
          </>
        )}
        <BottomNav
          showLabels={!habitVisible}
          active="home"
          onHome={() => setView('home')}
          onNew={() => setView('new')}
        />
        {habitOpen && habitVisible && (
          <HabitSheet
            habit={habit}
            day={selectedHabitDay}
            value={currentValue}
            onDay={setSelectedHabitDay}
            onToday={() => setSelectedHabitDay(todayHabitDay)}
            onClose={() => setHabitOpen(false)}
            onValue={(value) =>
              setProgressByDay((next) => ({ ...next, [selectedHabitDay]: value }))
            }
            onEdit={() => setView('edit')}
            onArchive={removeHabit}
            onDelete={removeHabit}
          />
        )}
        {calendarOpen && (
          <CalendarOverlay
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onReturnToday={() => setSelectedDate('today')}
            onClose={() => setCalendarOpen(false)}
          />
        )}
      </main>
    ),
    [
      calendarOpen,
      currentValue,
      habitOpen,
      habit,
      habitVisible,
      headerTitle,
      activeHomeTab,
      progressByDay,
      selectedDate,
      selectedHabitDay,
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
          setProgressByDay({
            Th: 0,
            Fr: 0,
            Sa: 0,
            Su: 0,
            Mo: 0,
            Tu: 0,
            We: 0,
          })
          setView('home')
        }}
      />
    )
  }

  return home
}

export default App
