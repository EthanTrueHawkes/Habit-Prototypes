import { useState } from 'react'
import './App.css'

type Page = 'explore' | 'track' | 'progress' | 'manage' | 'settings'
type Timeframe = 'daily' | 'weekly' | 'monthly'
type ManageFlow = 'main' | 'newHabit' | 'customHabit' | 'templateHabit'
type CustomHabitPopup = 'icon' | 'category' | 'frequency' | 'units' | 'reminder' | null
type Habit = {
  id: string
  exists: boolean
  name: string
  description: string
  category: string
  icon: string
  frequency: Timeframe
  progress: number
  progressHistory: Record<string, number>
  target: number
  unit: string
  color: string
  isGood: boolean
  occurrence: boolean[]
  startDate: string
  endDate: string
  requireMemo: boolean
  reminderName: string
}
type CustomHabitDraft = {
  name: string
  description: string
  category: string
  icon: string
  frequency: Timeframe | ''
  amount: string
  unit: string
  reminderName: string
  color: string
}
type ExploreCard = {
  title: string
  meta: string
  image: string
}
type ExploreContent = {
  featured: {
    title: string
    description: string
    meta: string
    image: string
  }
  sections: {
    title: string
    cards: ExploreCard[]
  }[]
}

const figma = {
  plus: '/icons/plus.svg',
  clock: '/icons/clock.svg',
  navExplore: '/icons/nav-explore.svg',
  navExploreActive: '/icons/nav-explore-active.svg',
  navTrack: '/icons/nav-track.svg',
  navTrackActive: '/icons/nav-track-active.svg',
  navProgress: '/icons/nav-progress.svg',
  navProgressActive: '/icons/nav-progress-active.svg',
  navManage: '/icons/nav-manage.svg',
  navManageActive: '/icons/nav-manage-active.svg',
  navSettings: '/icons/nav-settings.svg',
  navSettingsActive: '/icons/nav-settings-active.svg',
  chevronDown: '/icons/chevron-down.svg',
  habitNotebook: '/icons/habit-notebook.svg',
  running: '/icons/running.svg',
  hamburger: '/icons/hamburger.svg',
  commandPointer: '/icons/command-pointer.svg',
  commandView: '/icons/command-view.svg',
  commandReset: '/icons/command-reset.svg',
  commandSkip: '/icons/command-skip.svg',
  commandDelete: '/icons/command-delete.svg',
  popupClose: '/icons/popup-close.svg',
  detailChevron: '/icons/detail-chevron.svg',
  detailBack: '/icons/detail-back.svg',
  detailEdit: '/icons/detail-edit.svg',
  menuCalendar: '/icons/menu-calendar.svg',
  menuPlus: '/icons/menu-plus.svg',
  menuEdit: '/icons/menu-edit.svg',
  menuSkip: '/icons/menu-skip.svg',
  calendarChevronLeft: '/icons/calendar-chevron-left.svg',
  calendarChevronRight: '/icons/calendar-chevron-right.svg',
  arcSmallQuarter: '/icons/arc-small-quarter.svg',
  arcSmallBg: '/icons/arc-small-bg.svg',
  arcSmallProgress: '/icons/arc-small-progress.svg',
  manageMore: '/icons/manage-more.svg',
  managePlus: '/icons/manage-plus.svg',
  createHabit: '/icons/create-habit.svg',
  createReminder: '/icons/create-reminder.svg',
  newHabitBack: '/icons/new-habit-back.svg',
  newHabitExplore: '/icons/new-habit-explore.svg',
  newHabitCustom: '/icons/new-habit-custom.svg',
  newHabitRun: '/icons/new-habit-run.svg',
  newHabitArrow: '/icons/new-habit-arrow.svg',
  customHabitIcon: '/icons/custom-habit-icon.svg',
  selectedColorRing: '/icons/selected-color-ring.svg',
  colorWheel: '/icons/color-wheel.png',
  sheetCheck: '/icons/sheet-check.svg',
  templateRunIcon: '/icons/template-run-icon.svg',
  settingsProfile: '/icons/settings-profile.svg',
  settingsApp: '/icons/settings-app.svg',
  settingsAppearance: '/icons/settings-appearance.svg',
  settingsSun: '/icons/settings-sun.svg',
  settingsMoon: '/icons/settings-moon.svg',
  settingsPrivacy: '/icons/settings-privacy.svg',
  settingsTerms: '/icons/settings-terms.svg',
  settingsFeedback: '/icons/settings-feedback.svg',
  settingsLogout: '/icons/settings-logout.svg',
  settingsArrow: '/icons/settings-arrow.svg',
  settingsExternal: '/icons/settings-external.svg',
}

const habitIcons = [
  '/icons/habit-01.svg',
  '/icons/habit-02.svg',
  '/icons/habit-03.svg',
  '/icons/habit-04.svg',
  '/icons/habit-05.svg',
  '/icons/habit-06.svg',
  '/icons/habit-07.svg',
  '/icons/habit-08.svg',
  '/icons/habit-09.svg',
  '/icons/habit-10.svg',
  '/icons/habit-11.svg',
  '/icons/habit-12.svg',
  '/icons/habit-13.svg',
  '/icons/habit-14.svg',
  '/icons/habit-15.svg',
  '/icons/habit-16.svg',
  '/icons/habit-17.svg',
  '/icons/habit-18.svg',
  '/icons/habit-19.svg',
  '/icons/habit-20.svg',
  '/icons/habit-21.svg',
  '/icons/habit-22.svg',
  '/icons/habit-23.svg',
  '/icons/habit-24.svg',
  '/icons/habit-25.svg',
  '/icons/habit-26.svg',
  '/icons/habit-27.svg',
  '/icons/habit-28.svg',
]

const pages: { id: Page; label: string; icon: string; activeIcon: string }[] = [
  { id: 'explore', label: 'Explore', icon: figma.navExplore, activeIcon: figma.navExploreActive },
  { id: 'track', label: 'Track', icon: figma.navTrack, activeIcon: figma.navTrackActive },
  { id: 'progress', label: 'Progress', icon: figma.navProgress, activeIcon: figma.navProgressActive },
  { id: 'manage', label: 'Manage', icon: figma.navManage, activeIcon: figma.navManageActive },
  { id: 'settings', label: 'Settings', icon: figma.navSettings, activeIcon: figma.navSettingsActive },
]
const exploreImage = (fileName: string) => `/images/explore/${fileName}`
const exploreContent: Record<Timeframe, ExploreContent> = {
  daily: {
    featured: {
      title: 'Social Media Fast',
      description: 'Go without any social media for 30 days',
      meta: 'Marked Daily',
      image: exploreImage('figma-featured.png'),
    },
    sections: [
      {
        title: 'Lifestyle',
        cards: [
          { title: 'Morning Yoga', meta: '30 minutes', image: exploreImage('figma-yoga.png') },
          { title: 'Go Running', meta: '3 miles', image: exploreImage('running.jpg') },
          { title: 'Hydrate', meta: '8 cups', image: exploreImage('hydrate.jpg') },
        ],
      },
      {
        title: 'Abstinence',
        cards: [
          { title: 'No Sweets', meta: 'All day', image: exploreImage('sweets.jpg') },
          { title: 'No Coffee', meta: 'After 2 PM', image: exploreImage('coffee.jpg') },
          { title: 'Phone-Free Hour', meta: '1 hour', image: exploreImage('social-media.jpg') },
        ],
      },
      {
        title: 'Learn',
        cards: [
          { title: 'Read Pages', meta: '20 pages', image: exploreImage('reading.jpg') },
          { title: 'New Words', meta: '5 words', image: exploreImage('planning.jpg') },
          { title: 'Piano Practice', meta: '15 minutes', image: exploreImage('piano.jpg') },
        ],
      },
    ],
  },
  weekly: {
    featured: {
      title: 'Meal Prep',
      description: 'Plan meals and prep lunches for the week',
      meta: 'Marked Weekly',
      image: exploreImage('meal-prep.jpg'),
    },
    sections: [
      {
        title: 'Wellness',
        cards: [
          { title: 'Long Walk', meta: '3 miles', image: exploreImage('walk.jpg') },
          { title: 'Strength', meta: '2 sessions', image: exploreImage('strength.jpg') },
          { title: 'Sleep Reset', meta: '1 night', image: exploreImage('home-reset.jpg') },
        ],
      },
      {
        title: 'Home',
        cards: [
          { title: 'Laundry', meta: '1 load', image: exploreImage('home-reset.jpg') },
          { title: 'Grocery Run', meta: 'Weekly list', image: exploreImage('meal-prep.jpg') },
          { title: 'Clean Room', meta: '45 minutes', image: exploreImage('home-reset.jpg') },
        ],
      },
      {
        title: 'Connect',
        cards: [
          { title: 'Call Family', meta: '1 call', image: exploreImage('connect.jpg') },
          { title: 'Friend Check', meta: '1 message', image: exploreImage('connect.jpg') },
          { title: 'Date Night', meta: 'Plan it', image: exploreImage('date-night.jpg') },
        ],
      },
    ],
  },
  monthly: {
    featured: {
      title: 'Budget Review',
      description: 'Look back at spending and set the next plan',
      meta: 'Marked Monthly',
      image: exploreImage('planning.jpg'),
    },
    sections: [
      {
        title: 'Reflect',
        cards: [
          { title: 'Month Review', meta: '30 minutes', image: exploreImage('planning.jpg') },
          { title: 'Photo Sort', meta: '1 album', image: exploreImage('planning.jpg') },
          { title: 'Wins List', meta: '10 wins', image: exploreImage('planning.jpg') },
        ],
      },
      {
        title: 'Reset',
        cards: [
          { title: 'Deep Clean', meta: '1 room', image: exploreImage('home-reset.jpg') },
          { title: 'Inbox Zero', meta: 'Monthly', image: exploreImage('focused-work.jpg') },
          { title: 'Donate Items', meta: '5 items', image: exploreImage('home-reset.jpg') },
        ],
      },
      {
        title: 'Growth',
        cards: [
          { title: 'Skill Goal', meta: 'Pick one', image: exploreImage('focused-work.jpg') },
          { title: 'Book Finish', meta: '1 book', image: exploreImage('book.jpg') },
          { title: 'Plan Trip', meta: 'Next month', image: exploreImage('trip.jpg') },
        ],
      },
    ],
  },
}

const prototypeToday = '2020-06-10'
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function makeDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatTrackDate(dateKey: string) {
  const date = parseDateKey(dateKey)
  return `${monthNames[date.getMonth()]} ${date.getDate()}${getOrdinalSuffix(date.getDate())}`
}

function getOrdinalSuffix(day: number) {
  if (day >= 11 && day <= 13) {
    return 'th'
  }

  if (day % 10 === 1) return 'st'
  if (day % 10 === 2) return 'nd'
  if (day % 10 === 3) return 'rd'
  return 'th'
}

function getHabitProgressForDate(habit: Habit, dateKey: string) {
  if (dateKey === prototypeToday) {
    return habit.progressHistory[dateKey] ?? habit.progress
  }

  return habit.progressHistory[dateKey] ?? 0
}

function withProgressForDate(habit: Habit, dateKey: string): Habit {
  return {
    ...habit,
    progress: getHabitProgressForDate(habit, dateKey),
  }
}

function App() {
  const [page, setPage] = useState<Page>('explore')
  const [timeframe, setTimeframe] = useState<Timeframe>('daily')
  const [manageFlow, setManageFlow] = useState<ManageFlow>('main')
  const [customPopup, setCustomPopup] = useState<CustomHabitPopup>(null)
  const [categoryEntryOpen, setCategoryEntryOpen] = useState(false)
  const [categoryEntry, setCategoryEntry] = useState('')
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [customDraft, setCustomDraft] = useState<CustomHabitDraft>({
    name: '',
    description: '',
    category: '',
    icon: '',
    frequency: '',
    amount: '',
    unit: '',
    reminderName: '',
    color: '#005d8f',
  })
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 'habit-1',
      exists: true,
      name: 'Go Running',
      description: 'Go on a run each day for 3 miles. You got it!',
      category: 'Exercise',
      icon: figma.running,
      frequency: 'daily',
      progress: 1,
      progressHistory: {
        [prototypeToday]: 1,
        '2020-06-08': 1,
      },
      target: 4,
      unit: 'miles',
      color: '#005d8f',
      isGood: true,
      occurrence: [false, true, true, true, true, true, true],
      startDate: prototypeToday,
      endDate: '',
      requireMemo: false,
      reminderName: '',
    },
  ])
  const [selectedHabitId, setSelectedHabitId] = useState('habit-1')
  const [selectedDate, setSelectedDate] = useState(prototypeToday)
  const [trackMenuOpen, setTrackMenuOpen] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const [activeHabitActionsId, setActiveHabitActionsId] = useState<string | null>(null)
  const [progressSheetOpen, setProgressSheetOpen] = useState(false)
  const [trackDetailOpen, setTrackDetailOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const selectedDateHabits = habits.map((habit) => withProgressForDate(habit, selectedDate))
  const selectedHabit = selectedDateHabits.find((habit) => habit.id === selectedHabitId)

  const goToPage = (nextPage: Page) => {
    setPage(nextPage)
    setTrackMenuOpen(false)
    setCreateMenuOpen(false)
    setActiveHabitActionsId(null)
    setProgressSheetOpen(false)
    setTrackDetailOpen(false)
    setCalendarOpen(false)
    setManageFlow('main')
    setCustomPopup(null)
  }

  const updateHabit = (updatedHabit: Habit) => {
    setHabits((current) => current.map((habit) => (
      habit.id === updatedHabit.id
        ? {
            ...updatedHabit,
            progress: Math.min(updatedHabit.target, updatedHabit.progress),
            progressHistory: Object.fromEntries(
              Object.entries(updatedHabit.progressHistory).map(([date, value]) => (
                [date, Math.min(updatedHabit.target, value)]
              )),
            ),
          }
        : habit
    )))
  }

  const updateHabitProgress = (habitId: string, progress: number) => {
    setHabits((current) => (
      current.map((habit) => (
        habit.id === habitId
          ? {
              ...habit,
              progress: selectedDate === prototypeToday ? Math.min(habit.target, Math.max(0, progress)) : habit.progress,
              progressHistory: {
                ...habit.progressHistory,
                [selectedDate]: Math.min(habit.target, Math.max(0, progress)),
              },
            }
          : habit
      ))
    ))
  }

  const deleteHabit = (habitId: string) => {
    setHabits((current) => current.map((habit) => (habit.id === habitId ? { ...habit, exists: false } : habit)))
    setActiveHabitActionsId(null)
    setProgressSheetOpen(false)
    if (selectedHabitId === habitId) {
      const nextHabit = habits.find((habit) => habit.id !== habitId && habit.exists)
      setSelectedHabitId(nextHabit?.id || '')
      setTrackDetailOpen(false)
    }
  }

  const resetHabit = (habitId: string) => {
    setHabits((current) => current.map((habit) => (
      habit.id === habitId
        ? {
            ...habit,
            progress: selectedDate === prototypeToday ? 0 : habit.progress,
            progressHistory: { ...habit.progressHistory, [selectedDate]: 0 },
          }
        : habit
    )))
    setActiveHabitActionsId(null)
  }

  const openManageFlow = (flow: ManageFlow) => {
    setCreateMenuOpen(false)
    setCustomPopup(null)
    setCategoryEntryOpen(false)
    setCategoryEntry('')
    setManageFlow(flow)
  }

  const closeCustomPopup = () => {
    setCustomPopup(null)
    setCategoryEntryOpen(false)
    setCategoryEntry('')
  }

  const saveDraftAsHabit = (draft: CustomHabitDraft) => {
    const habitId = `habit-${Date.now()}`
    const nextHabit: Habit = {
      id: habitId,
      exists: true,
      name: draft.name || 'Go Running',
      description: draft.description || 'Go running each day for 1 mile.',
      category: draft.category || 'Fitness',
      icon: draft.icon || figma.running,
      frequency: draft.frequency || 'daily',
      progress: 0,
      progressHistory: {
        [prototypeToday]: 0,
      },
      target: Number(draft.amount) || 1,
      unit: draft.unit || 'Mile',
      color: draft.color,
      isGood: true,
      occurrence: [false, true, true, true, true, true, true],
      startDate: prototypeToday,
      endDate: '',
      requireMemo: false,
      reminderName: draft.reminderName,
    }
    setHabits((current) => [...current, nextHabit])
    setSelectedHabitId(habitId)
    setTimeframe(draft.frequency || 'daily')
    setPage('manage')
    setManageFlow('main')
    setCustomPopup(null)
    setCategoryEntryOpen(false)
    setCategoryEntry('')
    setCustomCategories([])
    setCustomDraft({
      name: '',
      description: '',
      category: '',
      icon: '',
      frequency: '',
      amount: '',
      unit: '',
      reminderName: '',
      color: '#005d8f',
    })
  }

  const inManageFlow = manageFlow !== 'main'

  return (
    <main className="prototype-stage">
      <div className="phone">
        {trackDetailOpen && selectedHabit && (
          <IndividualHabitScreen
            habit={selectedHabit}
            onBack={() => setTrackDetailOpen(false)}
            onSave={(updatedHabit) => {
              updateHabit(updatedHabit)
              setTimeframe(updatedHabit.frequency)
              setTrackDetailOpen(false)
            }}
          />
        )}
        {!trackDetailOpen && inManageFlow && (
          <ManageFlowScreen
            flow={manageFlow}
            draft={customDraft}
            setDraft={setCustomDraft}
            popup={customPopup}
            setPopup={setCustomPopup}
            categoryEntryOpen={categoryEntryOpen}
            setCategoryEntryOpen={setCategoryEntryOpen}
            categoryEntry={categoryEntry}
            setCategoryEntry={setCategoryEntry}
            customCategories={customCategories}
            setCustomCategories={setCustomCategories}
            onClosePopup={closeCustomPopup}
            onBack={() => openManageFlow(manageFlow === 'newHabit' ? 'main' : 'newHabit')}
            onExplore={() => {
              setManageFlow('main')
              goToPage('explore')
            }}
            onCustom={() => openManageFlow('customHabit')}
            onTemplate={() => openManageFlow('templateHabit')}
            onContinue={saveDraftAsHabit}
          />
        )}
        {!trackDetailOpen && !inManageFlow && (
          <>
        {page === 'explore' && (
          <ExploreScreen timeframe={timeframe} setTimeframe={setTimeframe} />
        )}
        {page === 'track' && (
          <TrackScreen
            habits={selectedDateHabits}
            selectedDate={selectedDate}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            menuOpen={trackMenuOpen}
            toggleMenu={() => {
              setActiveHabitActionsId(null)
              setTrackMenuOpen((open) => !open)
            }}
            activeHabitActionsId={activeHabitActionsId}
            setActiveHabitActionsId={setActiveHabitActionsId}
            onOpenLog={(habitId) => {
              setSelectedHabitId(habitId)
              setActiveHabitActionsId(null)
              setProgressSheetOpen(true)
            }}
            onOpenDetail={(habitId) => {
              setSelectedHabitId(habitId)
              setActiveHabitActionsId(null)
              setTrackDetailOpen(true)
            }}
            onReset={resetHabit}
            onDelete={deleteHabit}
            onOpenCalendar={() => {
              setTrackMenuOpen(false)
              setActiveHabitActionsId(null)
              setCalendarOpen(true)
            }}
          />
        )}
        {page === 'progress' && (
          <ProgressScreen habits={selectedDateHabits} timeframe={timeframe} setTimeframe={setTimeframe} />
        )}
        {page === 'manage' && (
          <ManageScreen
            habits={habits}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            menuOpen={createMenuOpen}
            toggleMenu={() => setCreateMenuOpen((open) => !open)}
            onCreateHabit={() => openManageFlow('newHabit')}
            onOpenDetail={(habitId) => {
              setSelectedHabitId(habitId)
              setCreateMenuOpen(false)
              setTrackDetailOpen(true)
            }}
          />
        )}
        {page === 'settings' && <SettingsScreen />}
        <BottomNav current={page} onChange={goToPage} />
        {page === 'track' && progressSheetOpen && selectedHabit?.exists && (
          <LogProgressSheet
            key={selectedHabit.id}
            habit={selectedHabit}
            onClose={() => setProgressSheetOpen(false)}
            onSave={(value) => {
              updateHabitProgress(selectedHabit.id, value)
              setProgressSheetOpen(false)
            }}
          />
        )}
        {page === 'track' && calendarOpen && (
          <TrackCalendarOverlay
            selectedDate={selectedDate}
            onClose={() => setCalendarOpen(false)}
            onConfirm={(dateKey) => {
              setSelectedDate(dateKey)
              setCalendarOpen(false)
            }}
          />
        )}
          </>
        )}
      </div>
    </main>
  )
}

function Header({
  title,
  subtitle,
  timeframe,
  setTimeframe,
  left,
  right,
  showSelector = true,
}: {
  title: string
  subtitle?: string
  timeframe?: Timeframe
  setTimeframe?: (timeframe: Timeframe) => void
  left?: React.ReactNode
  right?: React.ReactNode
  showSelector?: boolean
}) {
  return (
    <header className={`screen-header ${showSelector ? '' : 'header-compact'}`}>
      <div className="top-row">
        <div className="header-action left-action">{left}</div>
        <div className="header-title-copy">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="header-action right-action">{right}</div>
      </div>
      {showSelector && timeframe && setTimeframe && (
        <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
      )}
    </header>
  )
}

function TimeframeSelector({
  timeframe,
  setTimeframe,
}: {
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
}) {
  return (
    <div className="timeframe-selector" role="tablist" aria-label="Timeframe">
      {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((value) => (
        <button
          className={timeframe === value ? 'active' : ''}
          key={value}
          onClick={() => setTimeframe(value)}
          role="tab"
          type="button"
          aria-selected={timeframe === value}
        >
          {value[0].toUpperCase() + value.slice(1)}
        </button>
      ))}
    </div>
  )
}

function ExploreScreen({
  timeframe,
  setTimeframe,
}: {
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
}) {
  const content = exploreContent[timeframe]

  return (
    <section className="screen app-screen">
      <Header title="Explore" timeframe={timeframe} setTimeframe={setTimeframe} />
      <div className="explore-content timeframe-content" key={timeframe}>
        <section className="explore-section">
          <h2>Featured</h2>
          <FeaturedCard
            title={content.featured.title}
            description={content.featured.description}
            meta={content.featured.meta}
            image={content.featured.image}
          />
        </section>
        {content.sections.map((section) => (
          <section className="explore-section" key={section.title}>
            <h2>{section.title}</h2>
            <div className="horizontal-cards">
              {section.cards.map((card) => (
                <RecommendationCard card={card} key={`${section.title}-${card.title}`} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({
  title,
  description,
  meta,
  image,
}: {
  title: string
  description: string
  meta: string
  image: string
}) {
  return (
    <article className="featured-card">
      <img src={image} alt="" />
      <div className="card-scrim" />
      <button className="card-plus" type="button" aria-label={`Add ${title}`}>
        <img src={figma.plus} alt="" />
      </button>
      <div className="featured-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="card-meta">
        <img src={figma.clock} alt="" />
        <span>{meta}</span>
      </div>
    </article>
  )
}

function RecommendationCard({ card }: { card: ExploreCard }) {
  return (
    <article className="recommendation-card">
      <img src={card.image} alt="" />
      <div className="card-scrim" />
      <button className="card-plus" type="button" aria-label={`Add ${card.title}`}>
        <img src={figma.plus} alt="" />
      </button>
      <h3>{card.title}</h3>
      <div className="card-meta">
        <img src={figma.clock} alt="" />
        <span>{card.meta}</span>
      </div>
    </article>
  )
}

function TrackScreen({
  habits,
  selectedDate,
  timeframe,
  setTimeframe,
  menuOpen,
  toggleMenu,
  activeHabitActionsId,
  setActiveHabitActionsId,
  onOpenLog,
  onOpenDetail,
  onReset,
  onDelete,
  onOpenCalendar,
}: {
  habits: Habit[]
  selectedDate: string
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
  menuOpen: boolean
  toggleMenu: () => void
  activeHabitActionsId: string | null
  setActiveHabitActionsId: (habitId: string | null) => void
  onOpenLog: (habitId: string) => void
  onOpenDetail: (habitId: string) => void
  onReset: (habitId: string) => void
  onDelete: (habitId: string) => void
  onOpenCalendar: () => void
}) {
  const visibleHabits = habits.filter((habit) => habit.exists && timeframe === habit.frequency)
  const dateSubtitle = selectedDate === prototypeToday ? undefined : formatTrackDate(selectedDate)

  return (
    <section className="screen app-screen">
      <Header
        title="Track"
        subtitle={dateSubtitle}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        left={<IconButton icon={figma.hamburger} label="Open track menu" onClick={toggleMenu} />}
      />
      {menuOpen && (
        <PopupMenu className="track-popup" onClose={toggleMenu}>
          <MenuItem icon={figma.menuCalendar} label="Change Day" onClick={onOpenCalendar} />
          <MenuItem icon={figma.menuPlus} label="Add Habit" />
          <MenuItem icon={figma.menuEdit} label="Edit Habits" />
          <MenuItem icon={figma.menuSkip} label="Skip Habit" />
        </PopupMenu>
      )}
      {activeHabitActionsId && (
        <button
          className="command-dismiss"
          type="button"
          aria-label="Close habit commands"
          onClick={() => setActiveHabitActionsId(null)}
        />
      )}
      {visibleHabits.length > 0 && (
        <div className="track-content timeframe-content" key={`${timeframe}-${selectedDate}`}>
          <div className="category-row">
            <span>Category 1</span>
            <img src={figma.chevronDown} alt="" />
          </div>
          <div className="track-habit-list">
            {visibleHabits.map((habit) => {
              const commandsOpen = activeHabitActionsId === habit.id

              return (
                <div className={`track-habit-item ${commandsOpen ? 'commands-open' : ''}`} key={habit.id}>
                  <HabitProgressCard
                    habit={habit}
                    onOpenActions={() => {
                      setActiveHabitActionsId(commandsOpen ? null : habit.id)
                      setTrackMenuOpenSafe()
                    }}
                    onOpenLog={() => onOpenLog(habit.id)}
                  />
                  {commandsOpen && (
                    <HabitCommandTray
                      onView={() => onOpenDetail(habit.id)}
                      onReset={() => onReset(habit.id)}
                      onDelete={() => onDelete(habit.id)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )

  function setTrackMenuOpenSafe() {
    if (menuOpen) {
      toggleMenu()
    }
  }
}

function TrackCalendarOverlay({
  selectedDate,
  onClose,
  onConfirm,
}: {
  selectedDate: string
  onClose: () => void
  onConfirm: (dateKey: string) => void
}) {
  const initialDate = parseDateKey(selectedDate)
  const [displayMonth, setDisplayMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
  const [pendingDate, setPendingDate] = useState(selectedDate)
  const confirmVisible = pendingDate !== selectedDate
  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const calendarCells = Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstWeekday + 1

    return day >= 1 && day <= daysInMonth ? day : null
  })

  const changeMonth = (direction: -1 | 1) => {
    setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  return (
    <div className="calendar-layer">
      <button className="calendar-backdrop" type="button" aria-label="Close calendar" onClick={onClose} />
      <section className={`calendar-card ${confirmVisible ? 'with-action' : ''}`} aria-label="Change day">
        <div className="calendar-head">
          <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>
            <img src={figma.calendarChevronLeft} alt="" />
          </button>
          <h2>{monthNames[month]}</h2>
          <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>
            <img src={figma.calendarChevronRight} alt="" />
          </button>
        </div>
        <div className="calendar-grid">
          {weekdayLabels.map((weekday) => (
            <span className="calendar-weekday" key={weekday}>{weekday}</span>
          ))}
          {calendarCells.map((day, index) => {
            if (!day) {
              return <span className="calendar-day empty" key={`empty-${index}`} />
            }

            const dateKey = makeDateKey(year, month, day)
            const future = dateKey > prototypeToday
            const selected = dateKey === pendingDate

            return (
              <button
                className={`calendar-day ${future ? 'future' : ''} ${selected ? 'selected' : ''}`}
                type="button"
                aria-label={`${monthNames[month]} ${day}`}
                disabled={future}
                key={dateKey}
                onClick={() => setPendingDate(dateKey)}
              >
                {day}
              </button>
            )
          })}
        </div>
        {confirmVisible && (
          <button className="calendar-confirm" type="button" onClick={() => onConfirm(pendingDate)}>
            Select Day
          </button>
        )}
      </section>
    </div>
  )
}

function HabitProgressCard({
  habit,
  onOpenActions,
  onOpenLog,
}: {
  habit: Habit
  onOpenActions: () => void
  onOpenLog: () => void
}) {
  const fill = `${Math.min(1, habit.progress / habit.target) * 100}%`

  return (
    <div
      className="habit-progress-card"
      role="button"
      tabIndex={0}
      onClick={onOpenActions}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenActions()
        }
      }}
      aria-label="Open habit commands"
    >
      <div className="habit-progress-fill" style={{ width: fill }} />
      <div className="habit-inner">
        <div className={`habit-icon-box ${habit.icon !== figma.running ? 'gradient-icon' : ''}`}>
          <HabitIconMark icon={habit.icon} />
        </div>
        <div className="habit-text">
          <h3>{habit.name}</h3>
          <p>{habit.progress}/{habit.target} {habit.unit}</p>
        </div>
        <button
          className="habit-note"
          type="button"
          aria-label="Log progress"
          onClick={(event) => {
            event.stopPropagation()
            onOpenLog()
          }}
        >
          <img src={figma.habitNotebook} alt="" />
        </button>
      </div>
    </div>
  )
}

function HabitIconMark({ icon }: { icon: string }) {
  if (icon === figma.running || icon === '') {
    return <img src={icon || figma.running} alt="" />
  }

  return (
    <span
      className="habit-icon-glyph"
      aria-hidden="true"
      style={{
        WebkitMaskImage: `url(${icon})`,
        maskImage: `url(${icon})`,
      }}
    />
  )
}

function HabitCommandTray({
  onView,
  onReset,
  onDelete,
}: {
  onView: () => void
  onReset: () => void
  onDelete: () => void
}) {
  return (
    <div className="habit-command-tray">
      <img className="command-pointer" src={figma.commandPointer} alt="" />
      <div className="command-card">
        <CommandButton icon={figma.commandView} label="View" onClick={onView} />
        <CommandButton icon={figma.commandReset} label="Reset" onClick={onReset} />
        <CommandButton icon={figma.commandSkip} label="Skip" />
        <CommandButton icon={figma.commandDelete} label="Delete" destructive onClick={onDelete} />
      </div>
    </div>
  )
}

function CommandButton({
  icon,
  label,
  destructive,
  onClick,
}: {
  icon: string
  label: string
  destructive?: boolean
  onClick?: () => void
}) {
  return (
    <button className={`command-button ${destructive ? 'destructive' : ''}`} type="button" onClick={onClick}>
      <img src={icon} alt="" />
      <span>{label}</span>
    </button>
  )
}

function LogProgressSheet({
  habit,
  onClose,
  onSave,
}: {
  habit: Habit
  onClose: () => void
  onSave: (value: number) => void
}) {
  const [value, setValue] = useState(String(habit.progress))

  const updateValue = (nextValue: string) => {
    setValue(nextValue.replace(/\D/g, ''))
  }

  return (
    <div className="sheet-layer">
      <button className="sheet-backdrop" type="button" aria-label="Close log progress" onClick={onClose} />
      <section className="log-progress-sheet" aria-label="Log Progress">
        <div className="sheet-handle" />
        <button className="sheet-close icon-button" type="button" aria-label="Close log progress" onClick={onClose}>
          <img src={figma.popupClose} alt="" />
        </button>
        <h2>Log Progress</h2>
        <button
          className="sheet-save"
          type="button"
          onClick={() => onSave(value === '' ? 0 : Number(value))}
        >
          Save
        </button>
        <label className="progress-input-row">
          <span>Value:</span>
          <input
            aria-label="Progress value"
            inputMode="numeric"
            pattern="[0-9]*"
            type="text"
            value={value}
            onChange={(event) => updateValue(event.target.value)}
          />
          <span className="target-label">of {habit.target}</span>
        </label>
      </section>
    </div>
  )
}

const habitColors = [
  '#97d7fa', '#b0ffbd', '#fbb6ed', '#f3dbae', '#f9b1b1', '#e0aaf9',
  '#4fb9f3', '#63e578', '#f17eda', '#efb74f', '#ec6a6a', '#c165eb',
  '#319dd8', '#2fd24a', '#cf35b0', '#c5902d', '#d23232', '#9e2ed1',
  '#156996', '#169f2c', '#901578', '#855d13', '#730e0e', '#681290',
  '#005d8f', '#410505', '#1f4f05', '#4a0536', '#472405',
]

function IndividualHabitScreen({
  habit,
  onBack,
  onSave,
}: {
  habit: Habit
  onBack: () => void
  onSave: (habit: Habit) => void
}) {
  const [draft, setDraft] = useState<Habit>({ ...habit, occurrence: [...habit.occurrence] })

  const updateDraft = <Key extends keyof Habit>(key: Key, value: Habit[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const toggleOccurrence = (index: number) => {
    setDraft((current) => ({
      ...current,
      occurrence: current.occurrence.map((selected, dayIndex) => (
        dayIndex === index ? !selected : selected
      )),
    }))
  }

  const saveHabit = () => {
    onSave({
      ...draft,
      name: draft.name.trim() || habit.name,
      description: draft.description.trim(),
      target: Math.max(1, draft.target),
    })
  }

  return (
    <section className="screen detail-screen">
      <div className="detail-header">
        <button className="icon-button" type="button" aria-label="Back to previous screen" onClick={onBack}>
          <img src={figma.detailBack} alt="" />
        </button>
        <h1>{draft.name || habit.name}</h1>
        <button className="detail-save" type="button" onClick={saveHabit}>Save</button>
      </div>
      <div className="detail-content">
        <section className="detail-section">
          <h2>General</h2>
          <div className="detail-general-row">
            <div className={`detail-icon-box ${draft.icon !== figma.running ? 'gradient-icon' : ''}`}>
              <HabitIconMark icon={draft.icon} />
            </div>
            <input
              className="detail-field name-field"
              aria-label="Habit name"
              maxLength={50}
              value={draft.name}
              onChange={(event) => updateDraft('name', event.target.value)}
            />
          </div>
          <p className="detail-tip">Note: Be Specific. <span>Consider These Tips!</span></p>
          <label className="detail-textarea">
            <textarea
              aria-label="Habit description"
              maxLength={150}
              value={draft.description}
              onChange={(event) => updateDraft('description', event.target.value)}
            />
            <span>{draft.description.length}/150</span>
          </label>
        </section>

        <section className="detail-section">
          <h2>What color is this habit?</h2>
          <div className="detail-color-grid">
            {habitColors.map((color) => (
              <button
                className={draft.color === color ? 'selected' : ''}
                type="button"
                aria-label={`Set habit color ${color}`}
                aria-pressed={draft.color === color}
                key={color}
                onClick={() => updateDraft('color', color)}
              >
                <span style={{ backgroundColor: color }} />
              </button>
            ))}
            <label className="detail-custom-color" aria-label="Choose a custom habit color">
              <img src={figma.colorWheel} alt="" />
              <input
                type="color"
                value={draft.color}
                onChange={(event) => updateDraft('color', event.target.value)}
              />
            </label>
          </div>
        </section>

        <DetailSelectField
          label="What category is this habit?"
          ariaLabel="Habit category"
          value={draft.category}
          options={['Exercise', 'Fitness', 'Health', 'Lifestyle']}
          onChange={(value) => updateDraft('category', value)}
        />

        <DetailRadioGroup
          label="Is this habit good for you?"
          name="habit-good"
          value={draft.isGood}
          onChange={(value) => updateDraft('isGood', value)}
        />

        <DetailSelectField
          label="How frequent is this habit?"
          ariaLabel="Habit frequency"
          value={draft.frequency}
          options={['daily', 'weekly', 'monthly']}
          formatOption={(value) => value[0].toUpperCase() + value.slice(1)}
          onChange={(value) => updateDraft('frequency', value as Timeframe)}
        />

        <section className="detail-section">
          <h2>Occurance</h2>
          <div className="occurrence-card">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <button
                className={draft.occurrence[index] ? 'selected' : ''}
                type="button"
                aria-label={`Toggle ${weekdayLabels[index]}`}
                aria-pressed={draft.occurrence[index]}
                key={`${day}-${index}`}
                onClick={() => toggleOccurrence(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h2>How will you track it?</h2>
          <div className="detail-double">
            <input
              className="detail-field"
              aria-label="Goal amount"
              min="1"
              inputMode="numeric"
              type="number"
              value={draft.target}
              onChange={(event) => updateDraft('target', Number(event.target.value))}
            />
            <select
              className="detail-field"
              aria-label="Goal unit"
              value={draft.unit}
              onChange={(event) => updateDraft('unit', event.target.value)}
            >
              {Array.from(new Set([draft.unit, 'mile', 'miles', 'minute', 'minutes', 'times'])).map((unit) => (
                <option value={unit} key={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="detail-section">
          <h2>Start &amp; End Date</h2>
          <div className="detail-double">
            <DetailDateField
              ariaLabel="Habit start date"
              emptyLabel="Today"
              value={draft.startDate}
              onChange={(value) => updateDraft('startDate', value)}
            />
            <DetailDateField
              ariaLabel="Habit end date"
              emptyLabel="End"
              value={draft.endDate}
              onChange={(value) => updateDraft('endDate', value)}
            />
          </div>
        </section>

        <DetailRadioGroup
          label="Require Memo on Completion?"
          name="habit-memo"
          value={draft.requireMemo}
          onChange={(value) => updateDraft('requireMemo', value)}
        />

        <section className="detail-section">
          <h2>Custom Reminder?</h2>
          {draft.reminderName ? (
            <div className="detail-reminder-row">
              <input
                className="detail-field"
                aria-label="Reminder name"
                value={draft.reminderName}
                onChange={(event) => updateDraft('reminderName', event.target.value)}
              />
              <button type="button" onClick={() => updateDraft('reminderName', '')}>Remove</button>
            </div>
          ) : (
            <button
              className="detail-create-reminder"
              type="button"
              onClick={() => updateDraft('reminderName', 'Reminder')}
            >
              <span>+</span> Create
            </button>
          )}
        </section>
      </div>
    </section>
  )
}

function DetailSelectField({
  label,
  ariaLabel,
  value,
  options,
  formatOption = (option) => option,
  onChange,
}: {
  label: string
  ariaLabel: string
  value: string
  options: string[]
  formatOption?: (option: string) => string
  onChange: (value: string) => void
}) {
  return (
    <section className="detail-section">
      <h2>{label}</h2>
      <select
        className="detail-field detail-select"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option value={option} key={option}>{formatOption(option)}</option>
        ))}
      </select>
    </section>
  )
}

function DetailDateField({
  ariaLabel,
  emptyLabel,
  value,
  onChange,
}: {
  ariaLabel: string
  emptyLabel: string
  value: string
  onChange: (value: string) => void
}) {
  const displayValue = value === prototypeToday
    ? 'Today'
    : value
      ? value.split('-').reverse().join('/').replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$2/$1/$3')
      : emptyLabel

  return (
    <label className="detail-date-field">
      <span>{displayValue}</span>
      <img src={figma.detailChevron} alt="" />
      <input
        aria-label={ariaLabel}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function DetailRadioGroup({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <section className="detail-section">
      <h2>{label}</h2>
      <div className="detail-radio-card">
        <label>
          <input type="radio" name={name} checked={value} onChange={() => onChange(true)} />
          <span>Yes</span>
        </label>
        <label>
          <input type="radio" name={name} checked={!value} onChange={() => onChange(false)} />
          <span>No</span>
        </label>
      </div>
    </section>
  )
}

function ProgressScreen({
  habits,
  timeframe,
  setTimeframe,
}: {
  habits: Habit[]
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
}) {
  const visibleHabits = habits.filter((habit) => habit.exists && habit.frequency === timeframe)
  const completedCount = visibleHabits.filter((habit) => habit.progress >= habit.target).length
  const totalGoals = visibleHabits.length
  const displayCompleted = timeframe === 'daily' ? 6 : completedCount
  const displayTotal = timeframe === 'daily' ? 8 : totalGoals
  const completionRatio = displayTotal > 0 ? displayCompleted / displayTotal : 0
  const arcLength = 345.58

  return (
    <section className="screen app-screen">
      <Header title="Progress" timeframe={timeframe} setTimeframe={setTimeframe} />
      <div className="progress-content timeframe-content" key={timeframe}>
        <section className="progress-summary">
          <div className="large-arc">
            <svg className="large-arc-svg" width="240" height="120" viewBox="0 0 240 120" aria-hidden="true">
              <path className="large-arc-track" d="M 10 110 A 110 110 0 0 1 230 110" pathLength={arcLength} />
              <path
                className="large-arc-progress"
                d="M 10 110 A 110 110 0 0 1 230 110"
                pathLength={arcLength}
                style={{ strokeDasharray: `${completionRatio * arcLength} ${arcLength}` }}
              />
            </svg>
            <div className="large-arc-label">
              <strong>{`${displayCompleted} of ${displayTotal}`}</strong>
              <span>Goal Finished</span>
            </div>
          </div>
          <div className="metric-row">
            <MetricCard title="Best Goal" value={timeframe === 'daily' ? 'Go Running' : '-'} left="0 miles" right="3" fill={1} />
            <MetricCard title="Completion Rate" value={timeframe === 'daily' ? '75%' : '0%'} left="0 %" right="3" fill={0.69} />
          </div>
        </section>
        <section className="breakdown">
          <h2>Goals Breakdown</h2>
          <div className="breakdown-grid">
            {visibleHabits.map((habit) => (
              <SmallProgress habit={habit} key={habit.id} />
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function MetricCard({
  title,
  value,
  left,
  right,
  fill,
}: {
  title: string
  value: string
  left: string
  right: string
  fill: number
}) {
  return (
    <article className="metric-card">
      <p>{title}</p>
      <strong>{value}</strong>
      <div className="metric-bar">
        <span style={{ width: `${fill * 100}%` }} />
      </div>
      <div className="metric-scale">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </article>
  )
}

function SmallProgress({ habit }: { habit: Habit }) {
  const value = `${habit.progress}/${habit.target}`
  const ratio = habit.target > 0 ? habit.progress / habit.target : 0
  const showQuarterArc = ratio <= 0.25

  return (
    <div className="small-progress">
      {showQuarterArc ? (
        <SmallArcLayer crop="full" src={figma.arcSmallQuarter} />
      ) : (
        <>
          <SmallArcLayer crop="full" src={figma.arcSmallBg} />
          <SmallArcLayer crop="progress" src={figma.arcSmallProgress} />
        </>
      )}
      <img className="small-running" src={figma.running} alt="" />
      <strong>{value}</strong>
    </div>
  )
}

function SmallArcLayer({ crop, src }: { crop: 'full' | 'progress'; src: string }) {
  return (
    <div className="small-arc-layer">
      <div className="small-arc-rotation">
        <div className="small-arc-frame">
          <div className={`small-arc-crop ${crop}`}>
            <img src={src} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ManageScreen({
  habits,
  timeframe,
  setTimeframe,
  menuOpen,
  toggleMenu,
  onCreateHabit,
  onOpenDetail,
}: {
  habits: Habit[]
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
  menuOpen: boolean
  toggleMenu: () => void
  onCreateHabit: () => void
  onOpenDetail: (habitId: string) => void
}) {
  const visibleHabits = habits.filter((habit) => habit.exists && timeframe === habit.frequency)
  const [reminders, setReminders] = useState([
    { id: 'reminder-1', enabled: true },
    { id: 'reminder-2', enabled: true },
  ])

  const toggleReminder = (reminderId: string) => {
    setReminders((current) => (
      current.map((reminder) => (
        reminder.id === reminderId ? { ...reminder, enabled: !reminder.enabled } : reminder
      ))
    ))
  }

  return (
    <section className="screen app-screen">
      <Header
        title="Manage"
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        right={<IconButton icon={figma.managePlus} label="Create new" onClick={toggleMenu} />}
      />
      {menuOpen && (
        <PopupMenu className="create-popup" onClose={toggleMenu}>
          <MenuItem icon={figma.createHabit} label="Create Habit" onClick={onCreateHabit} />
          <MenuItem icon={figma.createReminder} label="Create Reminder" />
        </PopupMenu>
      )}
      {(visibleHabits.length > 0 || reminders.length > 0) && (
        <div className="manage-content timeframe-content" key={timeframe}>
          {visibleHabits.length > 0 && (
            <section className="manage-section">
              <h2>Goals</h2>
              <div className="manage-goals-list">
                {visibleHabits.map((habit) => (
                  <button
                    className="manage-goal-card"
                    type="button"
                    aria-label={`View ${habit.name}`}
                    key={habit.id}
                    onClick={() => onOpenDetail(habit.id)}
                  >
                    <div className={`manage-icon-box ${habit.icon !== figma.running ? 'gradient-icon' : ''}`}>
                      <HabitIconMark icon={habit.icon} />
                    </div>
                    <div>
                      <h3>{habit.name}</h3>
                      <p>{habit.target} {habit.unit}</p>
                    </div>
                    <img className="more-icon" src={figma.manageMore} alt="" />
                  </button>
                ))}
              </div>
            </section>
          )}
          <section className="manage-section reminder-section">
            <h2>Reminders</h2>
            <div className="reminder-list">
              {reminders.map((reminder) => (
                <article className="reminder-card" key={reminder.id}>
                  <div className="reminder-time">
                    <strong>4:00</strong>
                    <span>AM</span>
                  </div>
                  <p className="reminder-frequency">Everyday</p>
                  <p>Don&apos;t forget today&apos;s goals.</p>
                  <button
                    className={`reminder-toggle ${reminder.enabled ? 'on' : 'off'}`}
                    type="button"
                    aria-pressed={reminder.enabled}
                    aria-label="Toggle reminder"
                    onClick={() => toggleReminder(reminder.id)}
                  >
                    <span />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

function ManageFlowScreen({
  flow,
  draft,
  setDraft,
  popup,
  setPopup,
  categoryEntryOpen,
  setCategoryEntryOpen,
  categoryEntry,
  setCategoryEntry,
  customCategories,
  setCustomCategories,
  onClosePopup,
  onBack,
  onExplore,
  onCustom,
  onTemplate,
  onContinue,
}: {
  flow: ManageFlow
  draft: CustomHabitDraft
  setDraft: React.Dispatch<React.SetStateAction<CustomHabitDraft>>
  popup: CustomHabitPopup
  setPopup: (popup: CustomHabitPopup) => void
  categoryEntryOpen: boolean
  setCategoryEntryOpen: (open: boolean) => void
  categoryEntry: string
  setCategoryEntry: (value: string) => void
  customCategories: string[]
  setCustomCategories: React.Dispatch<React.SetStateAction<string[]>>
  onClosePopup: () => void
  onBack: () => void
  onExplore: () => void
  onCustom: () => void
  onTemplate: () => void
  onContinue: (draft: CustomHabitDraft) => void
}) {
  if (flow === 'newHabit') {
    return <NewHabitScreen onBack={onBack} onExplore={onExplore} onCustom={onCustom} onTemplate={onTemplate} />
  }

  const templateDraft: CustomHabitDraft = {
    name: draft.name || 'Go running',
    description: draft.description || 'Go running each day for 1 mile.',
    category: draft.category,
    icon: draft.icon || figma.templateRunIcon,
    frequency: draft.frequency,
    amount: draft.amount || '1',
    unit: draft.unit || 'Mile',
    reminderName: draft.reminderName,
    color: draft.color,
  }
  const shownDraft = flow === 'templateHabit' ? templateDraft : draft

  return (
    <>
      <HabitEditorScreen
        draft={shownDraft}
        setDraft={setDraft}
        template={flow === 'templateHabit'}
        onBack={onBack}
        onExplore={onExplore}
        onContinue={() => onContinue(shownDraft)}
        onPopup={setPopup}
      />
      {popup && (
        <CustomHabitSheet
          popup={popup}
          draft={shownDraft}
          setDraft={setDraft}
          categoryEntryOpen={categoryEntryOpen}
          setCategoryEntryOpen={setCategoryEntryOpen}
          categoryEntry={categoryEntry}
          setCategoryEntry={setCategoryEntry}
          customCategories={customCategories}
          setCustomCategories={setCustomCategories}
          onClose={onClosePopup}
        />
      )}
    </>
  )
}

function NewHabitScreen({
  onBack,
  onExplore,
  onCustom,
  onTemplate,
}: {
  onBack: () => void
  onExplore: () => void
  onCustom: () => void
  onTemplate: () => void
}) {
  const exercise = ['Go running', 'Daily walk', 'Morning stretches', 'Stand', 'Burn calories']
  const mind = ['Meditate', 'Read Books', 'Write in journal', 'Stand', 'Burn Calories']

  return (
    <section className="screen new-habit-screen">
      <NewHabitHeader onBack={onBack} onExplore={onExplore} />
      <div className="new-habit-list">
        <TemplateSection title="Exercise" items={exercise} firstAction={onTemplate} />
        <TemplateSection title="Mind" items={mind} />
      </div>
      <button className="custom-habit-sticky" type="button" onClick={onCustom}>
        <img src={figma.newHabitCustom} alt="" />
        <span>Custom Habit</span>
      </button>
    </section>
  )
}

function TemplateSection({
  title,
  items,
  firstAction,
}: {
  title: string
  items: string[]
  firstAction?: () => void
}) {
  return (
    <section className="template-section">
      <h2>{title}</h2>
      {items.map((item, index) => (
        <button
          className="template-card"
          type="button"
          key={`${title}-${item}-${index}`}
          onClick={index === 0 ? firstAction : undefined}
        >
          <span className="template-icon-box">
            <img src={figma.newHabitRun} alt="" />
          </span>
          <span className="template-copy">
            <strong>{item}</strong>
            <span>3 Miles</span>
          </span>
          <img className="template-arrow" src={figma.newHabitArrow} alt="" />
        </button>
      ))}
    </section>
  )
}

function NewHabitHeader({
  onBack,
  onExplore,
}: {
  onBack: () => void
  onExplore: () => void
}) {
  return (
    <header className="new-flow-header">
      <button className="icon-button" type="button" aria-label="Back" onClick={onBack}>
        <img src={figma.newHabitBack} alt="" />
      </button>
      <h1>New Habit</h1>
      <button className="icon-button" type="button" aria-label="Explore habits" onClick={onExplore}>
        <img src={figma.newHabitExplore} alt="" />
      </button>
    </header>
  )
}

function HabitEditorScreen({
  draft,
  setDraft,
  template,
  onBack,
  onExplore,
  onContinue,
  onPopup,
}: {
  draft: CustomHabitDraft
  setDraft: React.Dispatch<React.SetStateAction<CustomHabitDraft>>
  template: boolean
  onBack: () => void
  onExplore: () => void
  onContinue: () => void
  onPopup: (popup: CustomHabitPopup) => void
}) {
  const update = (key: keyof CustomHabitDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <section className="screen habit-editor-screen">
      <NewHabitHeader onBack={onBack} onExplore={onExplore} />
      <div className="habit-editor-scroll">
        <section className="editor-section">
          <h2>General</h2>
          <div className="habit-name-row">
            <div className="editor-icon-box">
              <button
                className={`editor-icon-trigger ${draft.icon ? 'selected' : ''}`}
                type="button"
                aria-label="Choose habit icon"
                onClick={() => onPopup('icon')}
              >
                <HabitIconMark icon={draft.icon || (template ? figma.templateRunIcon : figma.customHabitIcon)} />
              </button>
            </div>
            <input
              aria-label="Habit name"
              className="editor-input"
              placeholder="Name"
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
            />
          </div>
          <p className="specific-note">
            <span>Note: Be Specific.</span>
            <a>Consider These Tips!</a>
          </p>
          <label className="editor-textarea">
            <textarea
              aria-label="Habit description"
              maxLength={150}
              placeholder="Long description of habit. Why are you doing this? What is its purpose?"
              value={draft.description}
              onChange={(event) => update('description', event.target.value)}
            />
            <span>{draft.description.length}/150</span>
          </label>
        </section>
        <ColorPicker selected={draft.color} onSelect={(color) => update('color', color)} />
        <EditorSelect
          label="What category is this habit?"
          value={draft.category}
          placeholder="Category"
          onClick={() => onPopup('category')}
        />
        <EditorRadio label="Is this habit good for you?" />
        <EditorSelect
          label="How frequent is this habit?"
          value={formatTimeframe(draft.frequency)}
          placeholder="Frequency"
          onClick={() => onPopup('frequency')}
        />
        <OccurrencePicker />
        <section className="editor-section">
          <h2>How will you track it?</h2>
          <div className="editor-double">
            <input
              aria-label="Amount"
              className="editor-input"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Amount"
              value={draft.amount}
              onChange={(event) => update('amount', event.target.value.replace(/\D/g, ''))}
            />
            <button className={`editor-input editor-select ${draft.unit ? 'filled' : ''}`} type="button" onClick={() => onPopup('units')}>
              <span>{draft.unit || 'Units'}</span>
              <img src={figma.detailChevron} alt="" />
            </button>
          </div>
        </section>
        <section className="editor-section">
          <h2>Start &amp; End Date</h2>
          <div className="editor-double">
            <button className="editor-input editor-select muted" type="button">
              <span>Today</span>
              <img src={figma.detailChevron} alt="" />
            </button>
            <button className="editor-input editor-select muted" type="button">
              <span>End</span>
              <img src={figma.detailChevron} alt="" />
            </button>
          </div>
        </section>
        <EditorRadio label="Require Memo on Completion?" />
        <section className="editor-section">
          <h2>Custom Reminder?</h2>
          <button className={`editor-input reminder-create ${draft.reminderName ? 'filled' : ''}`} type="button" onClick={() => onPopup('reminder')}>
            <img src={figma.plus} alt="" />
            <span>{draft.reminderName || 'Create'}</span>
          </button>
        </section>
        <button className="editor-continue" type="button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  )
}

function ColorPicker({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (color: string) => void
}) {
  const colors = [
    '#97d7fa', '#b0ffbd', '#fbb6ed', '#f3dbae', '#f9b1b1', '#e0aaf9',
    '#4fb9f3', '#63e578', '#f17eda', '#efb74f', '#ec6a6a', '#c165eb',
    '#319dd8', '#2fd24a', '#cf35b0', '#c5902d', '#d23232', '#9e2ed1',
    '#156996', '#169f2c', '#901578', '#855d13', '#730e0e', '#681290',
    '#005d8f', '#410505', '#1f4f05', '#4a0536', '#472405', 'wheel',
  ]

  return (
    <section className="editor-section">
      <h2>What color is this habit?</h2>
      <div className="color-card">
        {colors.map((color) => (
          <button className="color-choice" type="button" key={color} onClick={() => color !== 'wheel' && onSelect(color)}>
            {color === 'wheel' ? (
              <img src={figma.colorWheel} alt="" />
            ) : (
              <>
                {selected === color && <img className="selected-ring" src={figma.selectedColorRing} alt="" />}
                <span style={{ background: color }} />
              </>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}

function EditorSelect({
  label,
  value,
  placeholder,
  onClick,
}: {
  label: string
  value: string
  placeholder: string
  onClick: () => void
}) {
  return (
    <section className="editor-section">
      <h2>{label}</h2>
      <button className={`editor-input editor-select ${value ? 'filled' : ''}`} type="button" onClick={onClick}>
        <span>{value || placeholder}</span>
        <img src={figma.detailChevron} alt="" />
      </button>
    </section>
  )
}

function EditorRadio({ label }: { label: string }) {
  const [selected, setSelected] = useState<'Yes' | 'No' | null>(null)

  return (
    <section className="editor-section">
      <h2>{label}</h2>
      <div className="editor-radio-card">
        {(['Yes', 'No'] as const).map((option) => (
          <button
            className={selected === option ? 'selected' : ''}
            key={option}
            type="button"
            onClick={() => setSelected(option)}
          >
            <span className="radio-mark">
              {selected === option && <img src={figma.sheetCheck} alt="" />}
            </span>
            {option}
          </button>
        ))}
      </div>
    </section>
  )
}

function OccurrencePicker() {
  return (
    <section className="editor-section">
      <h2>Occurance</h2>
      <div className="occurrence-card editor-occurrence">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span className={index === 0 ? '' : 'selected'} key={`${day}-${index}`}>
            {day}
          </span>
        ))}
      </div>
    </section>
  )
}

function CustomHabitSheet({
  popup,
  draft,
  setDraft,
  categoryEntryOpen,
  setCategoryEntryOpen,
  categoryEntry,
  setCategoryEntry,
  customCategories,
  setCustomCategories,
  onClose,
}: {
  popup: CustomHabitPopup
  draft: CustomHabitDraft
  setDraft: React.Dispatch<React.SetStateAction<CustomHabitDraft>>
  categoryEntryOpen: boolean
  setCategoryEntryOpen: (open: boolean) => void
  categoryEntry: string
  setCategoryEntry: (value: string) => void
  customCategories: string[]
  setCustomCategories: React.Dispatch<React.SetStateAction<string[]>>
  onClose: () => void
}) {
  const update = (key: keyof CustomHabitDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  if (popup === 'icon') {
    return (
      <BottomSheet title="Icons" height="icons" onClose={onClose}>
        <div className="icon-picker-grid">
          {habitIcons.map((icon, index) => (
            <button
              className={`icon-picker-choice ${draft.icon === icon ? 'selected' : ''}`}
              type="button"
              key={`${icon}-${index}`}
              aria-label={`Choose habit icon ${index + 1}`}
              onClick={() => {
                update('icon', icon)
                onClose()
              }}
            >
              <img src={icon} alt="" />
            </button>
          ))}
        </div>
      </BottomSheet>
    )
  }

  if (popup === 'category') {
    const saveCategory = () => {
      const nextCategory = categoryEntry.trim()
      if (nextCategory) {
        setCustomCategories((current) => (
          current.includes(nextCategory) ? current : [...current, nextCategory]
        ))
        setCategoryEntry('')
        setCategoryEntryOpen(false)
      }
    }

    return (
      <BottomSheet title="Category Manager" height="tall" onClose={onClose}>
        {customCategories.map((category) => (
          <SheetChoice
            key={category}
            label={category}
            selected={draft.category === category}
            onClick={() => {
              update('category', category)
              onClose()
            }}
          />
        ))}
        {!categoryEntryOpen && (
          <button className="create-category-button" type="button" onClick={() => setCategoryEntryOpen(true)}>
            <span>+</span>
            Create category
          </button>
        )}
        {categoryEntryOpen && (
          <input
            className="sheet-text-input"
            aria-label="Category name"
            autoFocus
            placeholder="Category name"
            value={categoryEntry}
            onChange={(event) => setCategoryEntry(event.target.value)}
            onBlur={saveCategory}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                saveCategory()
              }
            }}
          />
        )}
      </BottomSheet>
    )
  }

  if (popup === 'frequency') {
    return (
      <BottomSheet title="Frequency" height="tall" onClose={onClose}>
        {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((frequency) => (
          <SheetChoice
            key={frequency}
            label={formatTimeframe(frequency)}
            selected={draft.frequency === frequency}
            onClick={() => {
              update('frequency', frequency)
            }}
          />
        ))}
      </BottomSheet>
    )
  }

  if (popup === 'units') {
    return (
      <BottomSheet title="Unit Type" height="short" onClose={onClose}>
        {['Done', 'Times', 'Miles', 'Pages', 'Minutes', 'Hours', 'Cups', 'Custom'].map((unit) => (
          <SheetChoice
            key={unit}
            label={unit}
            selected={draft.unit === unit || (draft.unit === 'Mile' && unit === 'Miles')}
            onClick={() => update('unit', unit)}
          />
        ))}
      </BottomSheet>
    )
  }

  return (
    <BottomSheet title="Custom Reminder" height="tall" onClose={onClose}>
      <div className="reminder-sheet-fields">
        <label>
          <span>What should it be called?</span>
          <input
            aria-label="Reminder name"
            placeholder="Name"
            value={draft.reminderName}
            onChange={(event) => update('reminderName', event.target.value)}
          />
        </label>
        <label>
          <span>What time for the reminder?</span>
          <button className="sheet-field-select" type="button">
            12:00 PM
            <img src={figma.detailChevron} alt="" />
          </button>
        </label>
        <label>
          <span>What should it sound like?</span>
          <button className="sheet-field-select filled" type="button">
            Chirp
            <img src={figma.detailChevron} alt="" />
          </button>
        </label>
      </div>
    </BottomSheet>
  )
}

function BottomSheet({
  title,
  height,
  onClose,
  children,
}: {
  title: string
  height: 'short' | 'tall' | 'icons'
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="sheet-layer">
      <button className="sheet-backdrop" type="button" aria-label="Close" onClick={onClose} />
      <section className={`manage-bottom-sheet ${height}`} aria-label={title}>
        <div className="sheet-handle" />
        <button className="sheet-close icon-button" type="button" aria-label="Close" onClick={onClose}>
          <img src={figma.popupClose} alt="" />
        </button>
        <h2>{title}</h2>
        <div className="sheet-content">{children}</div>
      </section>
    </div>
  )
}

function SheetChoice({
  label,
  selected,
  onClick,
}: {
  label: string
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button className="sheet-choice" type="button" onClick={onClick}>
      <span>{label}</span>
      {selected && (
        <span className="choice-check">
          <img src={figma.sheetCheck} alt="" />
        </span>
      )}
    </button>
  )
}

function formatTimeframe(value: Timeframe | '') {
  return value ? value[0].toUpperCase() + value.slice(1) : ''
}

function SettingsScreen() {
  return (
    <section className="screen app-screen">
      <Header title="Settings" showSelector={false} />
      <div className="settings-content">
        <SettingsGroup
          title="General"
          rows={[
            { icon: figma.settingsProfile, label: 'Profile Details', arrow: 'chevron' },
            { icon: figma.settingsApp, label: 'App Settings', arrow: 'chevron' },
            { icon: figma.settingsAppearance, label: 'Appearance', trailing: <AppearanceToggle /> },
          ]}
        />
        <SettingsGroup
          title="Terms"
          rows={[
            { icon: figma.settingsPrivacy, label: 'Privacy Policy', arrow: 'external' },
            { icon: figma.settingsTerms, label: 'Terms & Conditions', arrow: 'external' },
          ]}
        />
        <SettingsGroup
          title="Actions"
          rows={[
            { icon: figma.settingsFeedback, label: 'App Feedback', arrow: 'chevron' },
            { icon: figma.settingsLogout, label: 'Logout' },
          ]}
        />
      </div>
    </section>
  )
}

function SettingsGroup({
  title,
  rows,
}: {
  title: string
  rows: {
    icon: string
    label: string
    arrow?: 'chevron' | 'external'
    trailing?: React.ReactNode
  }[]
}) {
  return (
    <section className="settings-group">
      <h2>{title}</h2>
      <div className="settings-card">
        {rows.map((row) => (
          <div className="settings-row" key={row.label}>
            <div className="settings-label">
              <img src={row.icon} alt="" />
              <span>{row.label}</span>
            </div>
            {row.trailing}
            {row.arrow === 'chevron' && (
              <span className="settings-arrow chevron" aria-hidden="true">
                <img src={figma.settingsArrow} alt="" />
              </span>
            )}
            {row.arrow === 'external' && (
              <img
                className="settings-arrow external"
                src={figma.settingsExternal}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function AppearanceToggle() {
  return (
    <div className="appearance-toggle">
      <img src={figma.settingsSun} alt="" />
      <div className="settings-switch">
        <span />
      </div>
      <img src={figma.settingsMoon} alt="" />
    </div>
  )
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick: () => void
}) {
  return (
    <button className="icon-button" type="button" onClick={onClick} aria-label={label}>
      <img src={icon} alt="" />
    </button>
  )
}

function PopupMenu({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode
  className: string
  onClose: () => void
}) {
  return (
    <div className="popup-layer">
      <button className="popup-backdrop" type="button" aria-label="Close menu" onClick={onClose} />
      <div className={`popup-menu ${className}`}>{children}</div>
    </div>
  )
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button className="menu-item" type="button" onClick={onClick}>
      <img src={icon} alt="" />
      <span>{label}</span>
    </button>
  )
}

function BottomNav({ current, onChange }: { current: Page; onChange: (page: Page) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {pages.map((item) => {
        const active = current === item.id

        return (
          <button
            className={active ? 'active' : ''}
            type="button"
            key={item.id}
            onClick={() => onChange(item.id)}
            aria-current={active ? 'page' : undefined}
          >
            <img src={active ? item.activeIcon : item.icon} alt="" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default App
