import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import './App.css'

import homeIcon from './assets/figma/home-active.svg'
import navNewIcon from './assets/figma/nav-new.svg'
import navProgressIcon from './assets/figma/nav-progress.svg'
import profileIcon from './assets/figma/profile.svg'
import flameIcon from './assets/figma/flame.svg'
import cardPlusIcon from './assets/figma/card-plus.svg'
import headerSortIcon from './assets/figma/header-sort.svg'
import headerPlusIcon from './assets/figma/header-plus.svg'
import allDayArcIcon from './assets/figma/chevron-down.svg'
import tabAllDayIcon from './assets/figma/tab-all-day.svg'
import tabMorningIcon from './assets/figma/tab-morning.svg'
import tabEveningIcon from './assets/figma/tab-evening.svg'
import runnerLargeIcon from './assets/figma/runner-large.svg'
import overlayPlusIcon from './assets/figma/overlay-plus.svg'
import overlayMinusIcon from './assets/figma/overlay-minus.svg'
import moreIcon from './assets/figma/more.svg'
import trendUpIcon from './assets/figma/trend-up.svg'
import statCompletedIcon from './assets/figma/stat-completed.svg'
import statMissedIcon from './assets/figma/stat-missed.svg'
import statSkippedIcon from './assets/figma/stat-skipped.svg'
import statNewIcon from './assets/figma/stat-new.svg'
import menuEditIcon from './assets/figma/menu-edit.svg'
import menuSkipIcon from './assets/figma/menu-skip.svg'
import menuArchiveIcon from './assets/figma/menu-archive.svg'
import menuDeleteIcon from './assets/figma/menu-delete.svg'
import backIcon from './assets/figma/back.svg'
import typeMakeIcon from './assets/figma/type-make.svg'
import editChevronIcon from './assets/figma/edit-chevron.svg'
import editCollapseIcon from './assets/figma/edit-collapse.svg'
import editAllDayIcon from './assets/figma/edit-all-day.svg'
import editMorningIcon from './assets/figma/edit-morning.svg'
import editMiddayIcon from './assets/figma/edit-midday.svg'
import editEveningIcon from './assets/figma/edit-evening.svg'
import editAddIcon from './assets/figma/edit-add.svg'
import editDateChevronIcon from './assets/figma/edit-date-chevron.svg'

type View = 'home' | 'edit'
type Sheet = 'none' | 'habit-popup' | 'habit-overlay'

const TODAY = 'June 10'
const dayChips = ['Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo']
const heatColors = ['#e4e7d2', '#97da90', '#37a398', '#006297']
const laurelLeftIcon = 'https://www.figma.com/api/mcp/asset/b73faef5-859c-4735-b2b9-2f13920226e7'
const laurelRightIcon = 'https://www.figma.com/api/mcp/asset/da30e880-c0bd-46ca-8be1-e324e9f7d008'
const calendarCloseIcon = 'https://www.figma.com/api/mcp/asset/78c117c2-66ba-443c-a1ab-126d406b73f4'

function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-time">9:41</span>
      <div className="status-icons">
        <span className="signal-bars"><i /><i /><i /><i /></span>
        <span className="wifi-mark" />
        <span className="battery-mark"><i /></span>
      </div>
    </div>
  )
}

function IconImg({ src, alt = '', size = 20 }: { src: string; alt?: string; size?: number }) {
  return <img src={src} alt={alt} width={size} height={size} />
}

function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg className="chevron-down" width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconButton({
  icon,
  label,
  onClick,
  className = '',
}: {
  icon: string
  label: string
  onClick?: () => void
  className?: string
}) {
  return (
    <button className={`icon-button ${className}`} aria-label={label} onClick={onClick}>
      <IconImg src={icon} size={20} />
    </button>
  )
}

function Header({
  selectedDate,
  calendarOpen,
  onCalendar,
}: {
  selectedDate: string
  calendarOpen: boolean
  onCalendar: () => void
}) {
  return (
    <header className="home-header">
      <StatusBar />
      <div className="home-top-row">
        <button className={`today-trigger ${calendarOpen ? 'is-open' : ''}`} onClick={onCalendar}>
          <span>{selectedDate === TODAY ? 'Today' : selectedDate}</span>
          <ChevronDown />
        </button>
        <div className="header-actions">
          {!calendarOpen && <IconButton icon={headerSortIcon} label="Sort habits" />}
          <IconButton icon={calendarOpen ? headerPlusIcon : profileIcon} label={calendarOpen ? 'Create habit' : 'Profile'} />
        </div>
      </div>
    </header>
  )
}

function TimeTabs() {
  const tabs = [
    { icon: allDayArcIcon, label: 'All Day', active: true },
    { icon: tabAllDayIcon, label: 'Morning' },
    { icon: tabMorningIcon, label: 'Afternoon' },
    { icon: tabEveningIcon, label: 'Evening' },
  ]

  return (
    <div className="time-tabs">
      {tabs.map((tab) => (
        <button className={`time-tab ${tab.active ? 'active' : ''}`} key={tab.label}>
          <IconImg src={tab.icon} size={20} />
          {tab.active && <span>{tab.label}</span>}
        </button>
      ))}
    </div>
  )
}

function ArcProgress({
  value,
  goal = 4,
  size = 'small',
}: {
  value: number
  goal?: number
  size?: 'small' | 'large'
}) {
  const config = size === 'large'
    ? { box: 200, center: 100, radius: 82, stroke: 20, arc: 390, gap: 126, rotation: 132 }
    : { box: 64, center: 32, radius: 25, stroke: 6, arc: 120, gap: 37, rotation: 132 }
  const total = 2 * Math.PI * config.radius
  const arcLength = Math.min(config.arc, total - config.gap)
  const progressLength = arcLength * Math.min(value / goal, 1)

  return (
    <svg className={`arc-progress ${size}`} viewBox={`0 0 ${config.box} ${config.box}`} aria-hidden="true">
      <circle
        className="arc-track"
        cx={config.center}
        cy={config.center}
        r={config.radius}
        strokeWidth={config.stroke}
        strokeDasharray={`${arcLength} ${total - arcLength}`}
        transform={`rotate(${config.rotation} ${config.center} ${config.center})`}
      />
      <circle
        className="arc-fill"
        cx={config.center}
        cy={config.center}
        r={config.radius}
        strokeWidth={config.stroke}
        strokeDasharray={`${progressLength} ${total - progressLength}`}
        transform={`rotate(${config.rotation} ${config.center} ${config.center})`}
      />
    </svg>
  )
}

function HabitBadge({ value, compact = false }: { value: number; compact?: boolean }) {
  return (
    <div className={`habit-badge ${compact ? 'compact' : ''}`}>
      <ArcProgress value={value} size={compact ? 'small' : 'large'} />
      <div className="runner-mark">
        <IconImg src={runnerLargeIcon} size={compact ? 28 : 72} />
      </div>
    </div>
  )
}

function HabitCard({ value, onOpen, onIncrement }: { value: number; onOpen: () => void; onIncrement: () => void }) {
  return (
    <div className="habit-card">
      <button className="habit-card-main" onClick={onOpen}>
        <HabitBadge value={value} compact />
        <div className="habit-card-copy">
          <strong>Go Running</strong>
          <span>{value} of 4 Miles</span>
        </div>
        <div className="streak-count">
          <IconImg src={flameIcon} size={14} />
          <span>12</span>
        </div>
      </button>
      <button className="card-add" aria-label="Add one mile" onClick={onIncrement}>
        <IconImg src={cardPlusIcon} size={20} />
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <section className="empty-state">
      <div className="welcome-copy">
        <strong>Welcome</strong>
        <span>Time to make your first habit</span>
      </div>
      <button className="habit-card empty-card">
        <HabitBadge value={0} compact />
        <div className="habit-card-copy empty-copy">
          <strong>Make a new habit</strong>
          <span>0 of 1</span>
        </div>
        <span className="card-add empty-add">
          <IconImg src={cardPlusIcon} size={20} />
        </span>
      </button>
    </section>
  )
}

function BottomNav() {
  const items = [
    { icon: homeIcon, label: 'Home', active: true },
    { icon: navNewIcon, label: 'New' },
    { icon: navProgressIcon, label: 'Progress' },
  ]
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button className={`bottom-nav-item ${item.active ? 'active' : ''}`} key={item.label}>
          <IconImg src={item.icon} size={24} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function DayStrip({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="day-strip">
      {dayChips.map((day, index) => (
        <button className={`day-chip ${selected === index ? 'selected' : ''}`} key={day} onClick={() => onSelect(index)}>
          <ArcProgress value={index < 3 ? 0 : index === 6 ? 3 : 1} size="small" />
          <span>{day}</span>
          {selected === index && <i />}
        </button>
      ))}
    </div>
  )
}

function StatsSummary({ showReturn, onReturnToday }: { showReturn?: boolean; onReturnToday?: () => void }) {
  return (
    <section className="stats-stack">
      {showReturn && (
        <button className="return-today" onClick={onReturnToday}>
          <span className="return-icon">↺</span>
          <span>Return to today</span>
        </button>
      )}
      <StreakCompletionCard />
      {/*
      <div className="streak-panel">
        <div className="laurel left">‹</div>
        <div className="streak-stat hot">
          <div><IconImg src={flameIcon} size={14} /><strong>3 Days</strong></div>
          <span>Current Streak</span>
        </div>
        <div className="streak-stat">
          <strong>13 Days</strong>
          <span>Best Streak</span>
        </div>
        <div className="laurel right">›</div>
      </div>
      */}
      <HeatmapCards />
      <ReminderCard />
    </section>
  )
}

function StreakCompletionCard() {
  return (
    <section className="streak-completion-card">
      <CompletionCard compact />
      <div className="streak-card-row">
        <img className="laurel-asset laurel-asset-left" src={laurelLeftIcon} alt="" />
        <div className="streak-card-stat hot">
          <div><IconImg src={flameIcon} size={14} /><strong>3 Days</strong></div>
          <span>Current Streak</span>
        </div>
        <div className="streak-card-stat">
          <strong>13 Days</strong>
          <span>Best Streak</span>
        </div>
        <img className="laurel-asset laurel-asset-right" src={laurelRightIcon} alt="" />
      </div>
    </section>
  )
}

function HeatmapCards() {
  return (
    <section className="heatmap-section">
      {['May', 'June'].map((month, monthIndex) => (
        <div className="heatmap-card" key={month}>
          <strong>{month}</strong>
          <div className="weekday-row">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={`${d}${i}`}>{d}</span>)}</div>
          <div className="heat-grid">
            {Array.from({ length: monthIndex === 0 ? 30 : 31 }, (_, i) => (
              <i style={{ backgroundColor: heatColors[(i + monthIndex) % heatColors.length] }} key={i} />
            ))}
          </div>
        </div>
      ))}
      <div className="heatmap-footer">
        <button>See All</button>
        <div className="heat-legend">
          <span><i />Less</span>
          <span><i />More</span>
        </div>
      </div>
    </section>
  )
}

function CompletionCard({ compact }: { compact?: boolean }) {
  const stats = [
    { icon: statCompletedIcon, label: 'Completed' },
    { icon: statMissedIcon, label: 'Missed' },
    { icon: statSkippedIcon, label: 'Skipped' },
    { icon: statNewIcon, label: 'New' },
  ]
  return (
    <section className={`completion-card ${compact ? 'compact' : ''}`}>
      <div className="completion-head">
        <strong>Monthly Completion Rate</strong>
        <div>
          <span><IconImg src={trendUpIcon} size={12} />4%</span>
          <b>90%</b>
        </div>
      </div>
      <div className="completion-bar"><i /></div>
      {!compact && (
        <div className="completion-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span><IconImg src={stat.icon} size={12} />{stat.label}</span>
              <strong>13 <small>Habits</small></strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function ReminderCard() {
  return (
    <section className="reminder-block">
      <strong>Reminders</strong>
      <div className="reminder-card">
        <div><b>4:00</b><span>AM</span></div>
        <small>Everyday</small>
        <p>Don’t forget today’s goals.</p>
        <i />
      </div>
    </section>
  )
}

function HabitPopup({
  value,
  menuOpen,
  onOpenOverlay,
  onValue,
  onMore,
  onEdit,
  onDelete,
}: {
  value: number
  menuOpen: boolean
  onOpenOverlay: () => void
  onValue: (value: number) => void
  onMore: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="habit-sheet popup-sheet" onClick={(event) => event.stopPropagation()}>
      <div className="sheet-handle" />
      <button className="sheet-more" onClick={onMore}>
        <IconImg src={moreIcon} size={20} />
      </button>
      {menuOpen && <EditMenu onEdit={onEdit} onDelete={onDelete} />}
      <button className="popup-main" onClick={onOpenOverlay}>
        <h2>Go Running</h2>
        <p>Daily <span>•</span> All Day</p>
        <HabitControl
          value={value}
          onMinus={() => onValue(Math.max(0, value - 1))}
          onPlus={() => onValue(Math.min(4, value + 1))}
        />
      </button>
      <DayStrip selected={6} onSelect={() => undefined} />
      <StatsSummary />
    </div>
  )
}

function EditMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const items = [
    { label: 'Edit Habit', icon: menuEditIcon, action: onEdit },
    { label: 'Skip Today', icon: menuSkipIcon },
    { label: 'Archive Habit', icon: menuArchiveIcon },
    { label: 'Delete Habit', icon: menuDeleteIcon, danger: true, action: onDelete },
  ]

  return (
    <div className="edit-menu">
      {items.map((item) => (
        <button className={item.danger ? 'danger' : ''} key={item.label} onClick={item.action}>
          <IconImg src={item.icon} size={20} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

function HabitControl({ value, onMinus, onPlus, onInput }: { value: number; onMinus?: () => void; onPlus?: () => void; onInput?: (value: number) => void }) {
  function stopControlClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  return (
    <div className="habit-control" onClick={stopControlClick}>
      <IconButton icon={overlayMinusIcon} label="Decrease value" onClick={onMinus} className="control-minus" />
      <div className="control-ring">
        <HabitBadge value={value} />
        <div className="value-entry">
          {onInput ? (
            <input
              aria-label="Habit value"
              value={value}
              min={0}
              max={4}
              type="number"
              onChange={(event) => onInput(Math.max(0, Math.min(4, Number(event.target.value) || 0)))}
            />
          ) : (
            <strong>{value}</strong>
          )}
          <span>of 4 miles</span>
        </div>
      </div>
      <IconButton icon={overlayPlusIcon} label="Increase value" onClick={onPlus} className="control-plus" />
    </div>
  )
}

function HabitOverlay({
  value,
  selectedDay,
  selectedPast,
  onValue,
  onDay,
  onMenu,
  menuOpen,
  onEdit,
  onDelete,
  onReturnToday,
}: {
  value: number
  selectedDay: number
  selectedPast: boolean
  onValue: (value: number) => void
  onDay: (index: number) => void
  onMenu: () => void
  menuOpen: boolean
  onEdit: () => void
  onDelete: () => void
  onReturnToday: () => void
}) {
  return (
    <div className={`habit-sheet overlay-sheet ${selectedPast ? 'past-day' : ''}`} onClick={(event) => event.stopPropagation()}>
      <div className="sheet-handle" />
      <button className="sheet-more" onClick={onMenu}>
        <IconImg src={moreIcon} size={20} />
      </button>
      {menuOpen && <EditMenu onEdit={onEdit} onDelete={onDelete} />}
      <header className="overlay-title">
        <h2>Go Running</h2>
        <p>Daily <span>•</span> All Day</p>
      </header>
      <HabitControl
        value={value}
        onMinus={() => onValue(Math.max(0, value - 1))}
        onPlus={() => onValue(Math.min(4, value + 1))}
        onInput={onValue}
      />
      <DayStrip selected={selectedDay} onSelect={onDay} />
      <StatsSummary showReturn={selectedPast} onReturnToday={onReturnToday} />
    </div>
  )
}

function CalendarOverlay({
  selectedDate,
  selectedPast,
  onSelectPast,
  onReturnToday,
  onClose,
}: {
  selectedDate: string
  selectedPast: boolean
  onSelectPast: (label: string) => void
  onReturnToday: () => void
  onClose: () => void
}) {
  const days = [null, ...Array.from({ length: 30 }, (_, i) => i + 1), null, null, null, null]
  return (
    <div className={`calendar-overlay ${selectedPast ? 'selected-past' : ''}`} onClick={(event) => event.stopPropagation()}>
      <StatusBar />
      <div className="calendar-header-row">
        <button className="calendar-today-trigger" onClick={onReturnToday}>
          <span>{selectedDate === TODAY ? 'Today' : selectedDate}</span>
          <ChevronDown />
        </button>
        <button className="calendar-close" aria-label="Close calendar" onClick={onClose}>
          <IconImg src={calendarCloseIcon} size={20} />
        </button>
      </div>
      <div className="calendar-preview" aria-hidden="true">
        <span>24<i /></span>
        <span>25<i /></span>
        <span>26<i /></span>
        <span>27<i /></span>
        <span>28<i /></span>
        <span>29<i /></span>
        <span>30<i /></span>
        <span>30<i /></span>
      </div>
      <div className="calendar-month">
        <strong>June</strong>
        <div className="calendar-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}</div>
        <div className="calendar-grid">
          {days.map((day, index) => (
            <button
              className={`${day === 10 ? 'selected' : ''} ${day && day > 10 ? 'future' : ''} ${!day ? 'empty' : ''}`}
              key={`${day ?? 'empty'}-${index}`}
              onClick={() => day && onSelectPast(`June ${day}`)}
            >
              <span>{day}</span>
              {day && day <= 10 && <i style={{ backgroundColor: heatColors[index % heatColors.length] }} />}
            </button>
          ))}
        </div>
      </div>
      {selectedPast && (
        <button className="calendar-return" onClick={onReturnToday}>
          <span>↺</span>
          Return to today
        </button>
      )}
      <div className="calendar-pulltab"><i /></div>
    </div>
  )
}

function HomeScreen({
  hasHabit,
  homeValue,
  popupValue,
  sheet,
  calendarOpen,
  selectedDate,
  selectedPast,
  selectedDay,
  menuOpen,
  onOpenCalendar,
  onOpenPopup,
  onOpenOverlay,
  onCloseOverlay,
  onIncrementHome,
  onDate,
  onToday,
  onValue,
  onDay,
  onMenu,
  onEdit,
  onDelete,
}: {
  hasHabit: boolean
  homeValue: number
  popupValue: number
  sheet: Sheet
  calendarOpen: boolean
  selectedDate: string
  selectedPast: boolean
  selectedDay: number
  menuOpen: boolean
  onOpenCalendar: () => void
  onOpenPopup: () => void
  onOpenOverlay: () => void
  onCloseOverlay: () => void
  onIncrementHome: () => void
  onDate: (label: string) => void
  onToday: () => void
  onValue: (value: number) => void
  onDay: (index: number) => void
  onMenu: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <main className="phone-frame">
      <Header selectedDate={selectedDate} calendarOpen={calendarOpen} onCalendar={onOpenCalendar} />
      <TimeTabs />
      {hasHabit ? (
        <section className="home-list">
          <HabitCard value={homeValue} onOpen={onOpenPopup} onIncrement={onIncrementHome} />
        </section>
      ) : (
        <EmptyState />
      )}
      {(calendarOpen || sheet !== 'none') && (
        <button className="outside-dismiss" aria-label="Close overlay" onClick={onCloseOverlay} />
      )}
      {calendarOpen && (
        <CalendarOverlay
          selectedDate={selectedDate}
          selectedPast={selectedPast}
          onSelectPast={onDate}
          onReturnToday={onToday}
          onClose={onCloseOverlay}
        />
      )}
      {sheet === 'habit-popup' && (
        <HabitPopup
          value={popupValue}
          menuOpen={menuOpen}
          onOpenOverlay={onOpenOverlay}
          onValue={onValue}
          onMore={onMenu}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {sheet === 'habit-overlay' && (
        <HabitOverlay
          value={popupValue}
          selectedDay={selectedDay}
          selectedPast={selectedPast}
          onValue={onValue}
          onDay={onDay}
          menuOpen={menuOpen}
          onMenu={onMenu}
          onEdit={onEdit}
          onDelete={onDelete}
          onReturnToday={onToday}
        />
      )}
      <BottomNav />
    </main>
  )
}

function EditHabitScreen({ onBack }: { onBack: () => void }) {
  return (
    <main className="phone-frame edit-frame">
      <StatusBar />
      <header className="edit-header">
        <IconButton icon={backIcon} label="Back to Home" onClick={onBack} />
        <h1>Edit Habit</h1>
        <button onClick={onBack}>Save</button>
      </header>
      <section className="edit-content">
        <FormSection title="Details">
          <div className="field full">Go Running</div>
          <div className="field-row">
            <div className="field split"><span>Icon</span><b>🏃‍♀️</b></div>
            <div className="field split"><span>Color</span><i className="color-dot" /></div>
          </div>
        </FormSection>
        <FormSection title="Type">
          <div className="field full type-field">
            <IconImg src={typeMakeIcon} size={20} />
            <div><strong>Make</strong><span>Build a routine you want to do more often.</span></div>
            <IconImg src={editChevronIcon} size={16} />
          </div>
        </FormSection>
        <FormSection title="Goal">
          <div className="field-row">
            <div className="field split">4</div>
            <div className="field split"><span>Times</span><IconImg src={editChevronIcon} size={16} /></div>
          </div>
          <div className="goal-panel">
            <div className="goal-panel-head"><span>Daily</span><IconImg src={editCollapseIcon} size={16} /></div>
            <div className="segmented"><b>Daily</b><span>Weekly</span><span>Monthly</span></div>
            <div className="week-select">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span className={index === 0 ? '' : 'selected'} key={`${day}${index}`}>{day}</span>)}</div>
          </div>
        </FormSection>
        <FormSection title="Time of day">
          <div className="time-of-day-edit">
            {[
              ['All Day', editAllDayIcon, true],
              ['Morning', editMorningIcon],
              ['Midday', editMiddayIcon],
              ['Evening', editEveningIcon],
            ].map(([label, icon, active]) => (
              <button className={active ? 'active' : ''} key={label as string}>
                <IconImg src={icon as string} size={24} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </FormSection>
        <FormSection title="Reminders">
          <div className="field full muted"><span>Create custom reminder</span><IconImg src={editAddIcon} size={20} /></div>
        </FormSection>
        <div className="field-row date-fields">
          <FormSection title="Start Date">
            <div className="field split"><span>Today</span><IconImg src={editDateChevronIcon} size={20} /></div>
          </FormSection>
          <FormSection title="End Date">
            <div className="field split"><span>Never</span><IconImg src={editDateChevronIcon} size={20} /></div>
          </FormSection>
        </div>
      </section>
    </main>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="form-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function App() {
  const [view, setView] = useState<View>('home')
  const [hasHabit, setHasHabit] = useState(true)
  const [sheet, setSheet] = useState<Sheet>('none')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [selectedPast, setSelectedPast] = useState(false)
  const [selectedDay, setSelectedDay] = useState(6)
  const [homeValueState, setHomeValueState] = useState(3)
  const [popupValue, setPopupValue] = useState(2)
  const [menuOpen, setMenuOpen] = useState(false)

  const homeValue = useMemo(() => (selectedPast ? popupValue : homeValueState), [homeValueState, popupValue, selectedPast])

  function returnToday() {
    setSelectedDate(TODAY)
    setSelectedPast(false)
    setSelectedDay(6)
    setPopupValue(2)
  }

  if (view === 'edit') {
    return <EditHabitScreen onBack={() => setView('home')} />
  }

  return (
    <HomeScreen
      hasHabit={hasHabit}
      homeValue={homeValue}
      popupValue={popupValue}
      sheet={sheet}
      calendarOpen={calendarOpen}
      selectedDate={selectedDate}
      selectedPast={selectedPast}
      selectedDay={selectedDay}
      menuOpen={menuOpen}
      onOpenCalendar={() => {
        setCalendarOpen((open) => !open)
        setSheet('none')
        setMenuOpen(false)
      }}
      onOpenPopup={() => {
        setCalendarOpen(false)
        setSheet('habit-popup')
        setMenuOpen(false)
      }}
      onOpenOverlay={() => setSheet('habit-overlay')}
      onCloseOverlay={() => {
        setCalendarOpen(false)
        setSheet('none')
        setMenuOpen(false)
      }}
      onIncrementHome={() => {
        if (selectedPast) {
          setPopupValue((value) => Math.min(4, value + 1))
          return
        }
        setHomeValueState((value) => Math.min(4, value + 1))
      }}
      onDate={(label) => {
        setSelectedDate(label)
        setSelectedPast(true)
        setPopupValue(1)
      }}
      onToday={returnToday}
      onValue={setPopupValue}
      onDay={(index) => {
        setSelectedDay(index)
        if (index === 3) {
          setSelectedPast(true)
          setSelectedDate('June 7')
          setPopupValue(1)
        }
      }}
      onMenu={() => setMenuOpen((open) => !open)}
      onEdit={() => {
        setMenuOpen(false)
        setView('edit')
      }}
      onDelete={() => {
        setHasHabit(false)
        setSheet('none')
        setMenuOpen(false)
      }}
    />
  )
}

export default App
