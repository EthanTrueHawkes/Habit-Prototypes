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
  yogaCard: 'https://www.figma.com/api/mcp/asset/67176fa4-e8f8-437f-9b38-cfb2a403dda7',
  featuredCard: 'https://www.figma.com/api/mcp/asset/72b9e8da-bc78-49dd-b4c2-005759fd4b6d',
  plus: 'https://www.figma.com/api/mcp/asset/26505dc9-1ba2-4076-97c5-029f4babae29',
  clock: 'https://www.figma.com/api/mcp/asset/254ecfc8-583a-420e-957a-1f7b8838d208',
  navExplore: 'https://www.figma.com/api/mcp/asset/2df2406a-ea4e-4bad-b595-66e78c2b33df',
  navExploreActive: 'https://www.figma.com/api/mcp/asset/c2ff72fd-c272-4124-86e0-31252d680a8d',
  navTrack: 'https://www.figma.com/api/mcp/asset/739c7df6-e5fc-4c57-b6bc-b236070e3099',
  navTrackActive: 'https://www.figma.com/api/mcp/asset/720f63b3-e34d-4c9f-8553-4043c1d5121d',
  navProgress: 'https://www.figma.com/api/mcp/asset/d1e004e0-43c0-4ecf-a400-018ddd7589b3',
  navProgressActive: 'https://www.figma.com/api/mcp/asset/4d3a960a-92b2-4092-8211-3c70ce989790',
  navManage: 'https://www.figma.com/api/mcp/asset/c172c12d-d0b6-4979-8802-00205c3962b4',
  navManageActive: 'https://www.figma.com/api/mcp/asset/1bfaf222-241e-49fc-8b0d-bafe8b92d755',
  navSettings: 'https://www.figma.com/api/mcp/asset/77d42471-d247-469b-9cb5-b188365c1e4a',
  navSettingsActive: 'https://www.figma.com/api/mcp/asset/d9549dcf-b068-40a9-a806-ce2ef99540d0',
  chevronDown: 'https://www.figma.com/api/mcp/asset/7cdd1e7d-64e6-48bf-8029-1e5df0a20f70',
  habitNotebook: 'https://www.figma.com/api/mcp/asset/c7ab27a4-7dfa-4ec2-a4e3-87d85e867ffe',
  running: 'https://www.figma.com/api/mcp/asset/1e800a30-1516-4f61-bf0a-26851e98fd32',
  hamburger: 'https://www.figma.com/api/mcp/asset/d32415f2-8207-456c-8cd8-4f6d93568d25',
  commandPointer: 'https://www.figma.com/api/mcp/asset/f9948e00-eaf9-4d0f-a053-b61fc857b1fb',
  commandView: 'https://www.figma.com/api/mcp/asset/9e82221c-e1cf-477b-9afc-94e1e3407363',
  commandReset: 'https://www.figma.com/api/mcp/asset/ec83d99e-3070-4417-bfab-5ca3432f9187',
  commandSkip: 'https://www.figma.com/api/mcp/asset/655d4dca-2a52-4328-a515-8de3776cf965',
  commandDelete: 'https://www.figma.com/api/mcp/asset/df037a9b-6770-4bcc-a08f-6277cf2e7910',
  popupClose: 'https://www.figma.com/api/mcp/asset/e55d26ac-1965-4104-b43f-f8fc148668c6',
  detailRunning: 'https://www.figma.com/api/mcp/asset/29d63602-144b-41e4-a584-eb9b3564b969',
  detailChevron: 'https://www.figma.com/api/mcp/asset/277edf15-4654-4215-b918-4773899745e1',
  detailBack: 'https://www.figma.com/api/mcp/asset/0aabfa27-eda1-4581-859f-98c8232416c7',
  detailEdit: 'https://www.figma.com/api/mcp/asset/ac7401c6-fc4b-4f7a-bb4c-fe9a32a98af4',
  menuCalendar: 'https://www.figma.com/api/mcp/asset/5cd7e45c-453d-4a73-b1b4-4fe817e5805c',
  menuPlus: 'https://www.figma.com/api/mcp/asset/15a10c23-fb5b-4f78-8213-baae9a76a6a1',
  menuEdit: 'https://www.figma.com/api/mcp/asset/95a884c0-18a9-46f7-88b9-377db6ff2e90',
  menuSkip: 'https://www.figma.com/api/mcp/asset/c06a2e27-6d8a-4f0b-81b6-f4b363cdd3a1',
  calendarChevronLeft: 'https://www.figma.com/api/mcp/asset/00953008-15dc-4893-b665-9d720777dbcc',
  calendarChevronRight: 'https://www.figma.com/api/mcp/asset/308dd9b7-82b5-4e3a-ad8b-999de1c5fffd',
  arcLargeBg: 'https://www.figma.com/api/mcp/asset/265385ab-162c-4fa7-82aa-b33184698acc',
  arcLargeProgress: 'https://www.figma.com/api/mcp/asset/89cc0789-f131-49ae-b704-8d75f9bea5fa',
  arcSmallQuarter: 'https://www.figma.com/api/mcp/asset/406ab8e0-68d1-46d0-8b29-120096f60d8c',
  arcSmallBg: 'https://www.figma.com/api/mcp/asset/ac564421-88d9-4216-b15a-0f095f0759d7',
  arcSmallProgress: 'https://www.figma.com/api/mcp/asset/5bcfddae-7e35-4319-85e6-e6ba08b14add',
  manageMore: 'https://www.figma.com/api/mcp/asset/93f8f24c-ec7c-4055-912f-beae90371602',
  managePlus: 'https://www.figma.com/api/mcp/asset/35642657-9ff9-49f9-86fb-d1a8b2fd126f',
  createHabit: 'https://www.figma.com/api/mcp/asset/9d06d323-9aa6-4c13-8df6-683af769cb22',
  createReminder: 'https://www.figma.com/api/mcp/asset/2327c1f8-9597-41ee-a274-d5bb23cd0a4b',
  newHabitBack: 'https://www.figma.com/api/mcp/asset/db5feaad-6adb-402d-b9d7-043102007969',
  newHabitExplore: 'https://www.figma.com/api/mcp/asset/6fba93f8-2975-4fa6-b587-f114b8baeda4',
  newHabitCustom: 'https://www.figma.com/api/mcp/asset/edb6b304-89f9-4226-8c57-16438c09b029',
  newHabitRun: 'https://www.figma.com/api/mcp/asset/3462c7ae-fe42-4446-9164-b1292807ff4d',
  newHabitArrow: 'https://www.figma.com/api/mcp/asset/1fc9e253-67fc-47b2-b5ef-e2d42644a559',
  customHabitIcon: 'https://www.figma.com/api/mcp/asset/c329e95f-ab83-4e28-9440-4b7fd379cf46',
  selectedColorRing: 'https://www.figma.com/api/mcp/asset/ab863d66-2ab2-489c-aec0-5f2d6984c9cc',
  colorWheel: 'https://www.figma.com/api/mcp/asset/ccbc5f67-f39a-4aa0-bae3-d51daebfca11',
  sheetCheck: 'https://www.figma.com/api/mcp/asset/e02ab08f-e1c8-4af9-aa81-fb918f4dc85a',
  templateRunIcon: 'https://www.figma.com/api/mcp/asset/91065155-6fa7-4bab-bda8-252192617d56',
  settingsProfile: 'https://www.figma.com/api/mcp/asset/27b2bf9d-cd19-4fea-bc83-ad286ccbf764',
  settingsApp: 'https://www.figma.com/api/mcp/asset/a4423d6b-5bb7-4f41-81cd-78b24b32f99f',
  settingsAppearance: 'https://www.figma.com/api/mcp/asset/d5a8cbff-0f03-4888-8ed2-15574fb79493',
  settingsSun: 'https://www.figma.com/api/mcp/asset/c4fd02fe-e34d-458b-b7e9-889af3bfc15b',
  settingsMoon: 'https://www.figma.com/api/mcp/asset/40b71c91-f563-4806-97fb-de034a8b0682',
  settingsPrivacy: 'https://www.figma.com/api/mcp/asset/9462c8ca-0e4a-4241-9d00-2753ab803567',
  settingsTerms: 'https://www.figma.com/api/mcp/asset/49a94472-7dc8-4e9e-8de9-254974a97409',
  settingsFeedback: 'https://www.figma.com/api/mcp/asset/96949357-f3ac-4920-a814-91170cbb4782',
  settingsLogout: 'https://www.figma.com/api/mcp/asset/c25e7b71-58ac-431c-95e5-0e4de5573e2e',
  settingsArrow: 'https://www.figma.com/api/mcp/asset/8aa18f38-20ad-42c1-aedb-8d95383979e4',
  settingsExternal: 'https://www.figma.com/api/mcp/asset/01e4ed7f-c905-477b-9137-a50ff96aff08',
}

const habitIcons = [
  'https://www.figma.com/api/mcp/asset/57ebfdd1-3c73-4d51-80dc-4aae7ad6a513',
  'https://www.figma.com/api/mcp/asset/c90082f6-a078-4943-ac35-4acd59be39ff',
  'https://www.figma.com/api/mcp/asset/f53b4b00-ef7e-4211-85cd-abba3228825e',
  'https://www.figma.com/api/mcp/asset/613a6f77-eec2-4bd7-954c-46e7e0a7329d',
  'https://www.figma.com/api/mcp/asset/611ab309-71bb-4a4a-bbaa-59548246fd82',
  'https://www.figma.com/api/mcp/asset/4f59a109-586c-4d92-9522-8d9b7ce50217',
  'https://www.figma.com/api/mcp/asset/7323ab88-b37c-4a2b-9715-80b4ab14f5f3',
  'https://www.figma.com/api/mcp/asset/50d4deb0-f33f-4d45-9372-539a35d64a0c',
  'https://www.figma.com/api/mcp/asset/fa2beaf5-5dc6-40cb-bd99-759c41f8ce51',
  'https://www.figma.com/api/mcp/asset/de3c34d1-8d41-4c2d-be18-b3df7c657858',
  'https://www.figma.com/api/mcp/asset/50d4deb0-f33f-4d45-9372-539a35d64a0c',
  'https://www.figma.com/api/mcp/asset/a1d1e268-64f6-48a8-8c70-efc0b81b0d1e',
  'https://www.figma.com/api/mcp/asset/1c75c747-04da-438d-bc86-bca6dd2560a9',
  'https://www.figma.com/api/mcp/asset/8127acd0-92ec-4e77-8699-897c15772d4f',
  'https://www.figma.com/api/mcp/asset/3db99b69-19ef-4a59-b08c-e14ca20c3516',
  'https://www.figma.com/api/mcp/asset/35c61558-242c-4f19-83b9-dafbc2b34522',
  'https://www.figma.com/api/mcp/asset/f25c59e7-2687-41fa-9116-0314bdae8380',
  'https://www.figma.com/api/mcp/asset/9153726e-fa65-46eb-be20-3cd9a58cabb1',
  'https://www.figma.com/api/mcp/asset/cd4d5b80-7e38-4160-a88d-b208f27a2420',
  'https://www.figma.com/api/mcp/asset/8c4afa0c-8ac4-4527-bccf-99a704e99c59',
  'https://www.figma.com/api/mcp/asset/b5fa2ae2-e6cc-4905-b566-9f0d14018d37',
  'https://www.figma.com/api/mcp/asset/1761a4ce-5321-4716-9733-7d4bff979ae5',
  'https://www.figma.com/api/mcp/asset/b2f7cfb4-ff1d-45e8-9871-65c6a8ef884f',
  'https://www.figma.com/api/mcp/asset/49445f19-d2cc-4dbe-add5-776c83ec277c',
  'https://www.figma.com/api/mcp/asset/f52cb12a-9db3-4148-8502-017ca8e334a6',
  'https://www.figma.com/api/mcp/asset/d9a7c431-4189-492d-b3c6-0ce67d9e2e89',
  'https://www.figma.com/api/mcp/asset/69a830d5-211c-4cc8-b04d-ee4862e92cc8',
  'https://www.figma.com/api/mcp/asset/a5758ade-8b0e-496a-bf15-4cf1ca854044',
]

const pages: { id: Page; label: string; icon: string; activeIcon: string }[] = [
  { id: 'explore', label: 'Explore', icon: figma.navExplore, activeIcon: figma.navExploreActive },
  { id: 'track', label: 'Track', icon: figma.navTrack, activeIcon: figma.navTrackActive },
  { id: 'progress', label: 'Progress', icon: figma.navProgress, activeIcon: figma.navProgressActive },
  { id: 'manage', label: 'Manage', icon: figma.navManage, activeIcon: figma.navManageActive },
  { id: 'settings', label: 'Settings', icon: figma.navSettings, activeIcon: figma.navSettingsActive },
]
const imageUrl = (id: string, width = 600) => (
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
)
const exploreContent: Record<Timeframe, ExploreContent> = {
  daily: {
    featured: {
      title: 'Social Media Fast',
      description: 'Go without any social media for 30 days',
      meta: 'Marked Daily',
      image: imageUrl('photo-1512428559087-560fa5ceab42', 900),
    },
    sections: [
      {
        title: 'Lifestyle',
        cards: [
          { title: 'Morning Yoga', meta: '30 minutes', image: imageUrl('photo-1686749143613-0eeacff36894') },
          { title: 'Go Running', meta: '3 miles', image: imageUrl('photo-1606934369778-3fb8d461404b') },
          { title: 'Hydrate', meta: '8 cups', image: imageUrl('photo-1618683133131-3c8907882c7c') },
        ],
      },
      {
        title: 'Abstinence',
        cards: [
          { title: 'No Sweets', meta: 'All day', image: imageUrl('photo-1575549595260-623d27ba5e44') },
          { title: 'No Coffee', meta: 'After 2 PM', image: imageUrl('photo-1495474472287-4d71bcdd2085') },
          { title: 'Phone-Free Hour', meta: '1 hour', image: imageUrl('photo-1512428559087-560fa5ceab42') },
        ],
      },
      {
        title: 'Learn',
        cards: [
          { title: 'Read Pages', meta: '20 pages', image: imageUrl('photo-1666712304790-65771bc6b84e') },
          { title: 'New Words', meta: '5 words', image: imageUrl('photo-1635919369994-85cb78c9cc95') },
          { title: 'Piano Practice', meta: '15 minutes', image: imageUrl('photo-1652181820522-cc76583c9950') },
        ],
      },
    ],
  },
  weekly: {
    featured: {
      title: 'Meal Prep',
      description: 'Plan meals and prep lunches for the week',
      meta: 'Marked Weekly',
      image: imageUrl('photo-1666819691666-4be36926335e', 900),
    },
    sections: [
      {
        title: 'Wellness',
        cards: [
          { title: 'Long Walk', meta: '3 miles', image: imageUrl('photo-1670438664569-36545ddc7a7f') },
          { title: 'Strength', meta: '2 sessions', image: imageUrl('photo-1586066626871-9e697071bda6') },
          { title: 'Sleep Reset', meta: '1 night', image: imageUrl('photo-1718717621302-a359be21a111') },
        ],
      },
      {
        title: 'Home',
        cards: [
          { title: 'Laundry', meta: '1 load', image: imageUrl('photo-1718717621302-a359be21a111') },
          { title: 'Grocery Run', meta: 'Weekly list', image: imageUrl('photo-1666819691666-4be36926335e', 900) },
          { title: 'Clean Room', meta: '45 minutes', image: imageUrl('photo-1718717621302-a359be21a111') },
        ],
      },
      {
        title: 'Connect',
        cards: [
          { title: 'Call Family', meta: '1 call', image: imageUrl('photo-1663743629963-6301379e8824') },
          { title: 'Friend Check', meta: '1 message', image: imageUrl('photo-1663743629963-6301379e8824') },
          { title: 'Date Night', meta: 'Plan it', image: imageUrl('photo-1675077978387-3975ed3579b4') },
        ],
      },
    ],
  },
  monthly: {
    featured: {
      title: 'Budget Review',
      description: 'Look back at spending and set the next plan',
      meta: 'Marked Monthly',
      image: imageUrl('photo-1635919369994-85cb78c9cc95', 900),
    },
    sections: [
      {
        title: 'Reflect',
        cards: [
          { title: 'Month Review', meta: '30 minutes', image: imageUrl('photo-1635919369994-85cb78c9cc95') },
          { title: 'Photo Sort', meta: '1 album', image: imageUrl('photo-1635919369994-85cb78c9cc95') },
          { title: 'Wins List', meta: '10 wins', image: imageUrl('photo-1635919369994-85cb78c9cc95') },
        ],
      },
      {
        title: 'Reset',
        cards: [
          { title: 'Deep Clean', meta: '1 room', image: imageUrl('photo-1718717621302-a359be21a111') },
          { title: 'Inbox Zero', meta: 'Monthly', image: imageUrl('photo-1499750310107-5fef28a66643') },
          { title: 'Donate Items', meta: '5 items', image: imageUrl('photo-1718717621302-a359be21a111') },
        ],
      },
      {
        title: 'Growth',
        cards: [
          { title: 'Skill Goal', meta: 'Pick one', image: imageUrl('photo-1499750310107-5fef28a66643') },
          { title: 'Book Finish', meta: '1 book', image: imageUrl('photo-1579206630372-ea5c6176866e') },
          { title: 'Plan Trip', meta: 'Next month', image: imageUrl('photo-1502920917128-1aa500764cbd') },
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

  const updateHabitFrequency = (habitId: string, frequency: Timeframe) => {
    setHabits((current) => (
      current.map((habit) => (habit.id === habitId ? { ...habit, frequency } : habit))
    ))
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
            onFrequencyChange={(frequency) => updateHabitFrequency(selectedHabit.id, frequency)}
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
    <section className="screen">
      <Header title="Explore" timeframe={timeframe} setTimeframe={setTimeframe} />
      <div className="explore-content">
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
    <section className="screen">
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
        <div className="track-content">
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

function IndividualHabitScreen({
  habit,
  onBack,
  onFrequencyChange,
}: {
  habit: Habit
  onBack: () => void
  onFrequencyChange: (frequency: Timeframe) => void
}) {
  return (
    <section className="screen detail-screen">
      <div className="detail-header">
        <button className="icon-button" type="button" aria-label="Back to Track" onClick={onBack}>
          <img src={figma.detailBack} alt="" />
        </button>
        <h1>{habit.name}</h1>
        <button className="icon-button" type="button" aria-label="Edit habit">
          <img src={figma.detailEdit} alt="" />
        </button>
      </div>
      <div className="detail-content">
        <section className="detail-section">
          <h2>General</h2>
          <div className="detail-general-row">
            <div className="detail-color-swatch" />
            <div className={`detail-icon-box ${habit.icon !== figma.running ? 'gradient-icon' : ''}`}>
              <HabitIconMark icon={habit.icon} />
            </div>
            <div className="detail-field name-field">{habit.name}</div>
          </div>
          <div className="detail-textarea">
            <p>{habit.description}</p>
            <span>28/150</span>
          </div>
        </section>
        <DetailSelect label="Category" value={habit.category} />
        <DetailSelect label="Habit Type" value="Make" />
        <section className="detail-section">
          <h2>How frequent is this habit?</h2>
          <div className="frequency-buttons">
            {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((frequency) => (
              <button
                className={habit.frequency === frequency ? 'selected' : ''}
                key={frequency}
                type="button"
                onClick={() => onFrequencyChange(frequency)}
              >
                {frequency[0].toUpperCase() + frequency.slice(1)}
              </button>
            ))}
          </div>
        </section>
        <section className="detail-section">
          <h2>Occurance</h2>
          <div className="occurrence-card">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span className={index === 0 ? '' : 'selected'} key={`${day}-${index}`}>
                {day}
              </span>
            ))}
          </div>
        </section>
        <DetailDouble label="Start & End Date" left="Start" right="End" />
        <DetailDouble label="Require Memo on Completion?" left="Yes" right="No" />
        <DetailDouble label="Custom Reminder?" left="Make" right="Break" />
        <DetailSingle label="What time for the reminder?" value="Make" />
        <DetailSingle label="What should it be called?" value="Make" />
        <DetailDouble label="What should it sound like?" left="Start" right="End" />
      </div>
    </section>
  )
}

function DetailSelect({ label, value }: { label: string; value: string }) {
  return (
    <section className="detail-section">
      <h2>{label}</h2>
      <div className="detail-field select-field">
        <span>{value}</span>
        <img src={figma.detailChevron} alt="" />
      </div>
    </section>
  )
}

function DetailSingle({ label, value }: { label: string; value: string }) {
  return (
    <section className="detail-section">
      <h2>{label}</h2>
      <div className="detail-field muted-field">{value}</div>
    </section>
  )
}

function DetailDouble({ label, left, right }: { label: string; left: string; right: string }) {
  return (
    <section className="detail-section">
      <h2>{label}</h2>
      <div className="detail-double">
        <div className="detail-field muted-field">{left}</div>
        <div className="detail-field muted-field">{right}</div>
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
    <section className="screen">
      <Header title="Progress" timeframe={timeframe} setTimeframe={setTimeframe} />
      <div className="progress-content">
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
}: {
  habits: Habit[]
  timeframe: Timeframe
  setTimeframe: (timeframe: Timeframe) => void
  menuOpen: boolean
  toggleMenu: () => void
  onCreateHabit: () => void
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
    <section className="screen">
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
        <div className="manage-content">
          {visibleHabits.length > 0 && (
            <section className="manage-section">
              <h2>Goals</h2>
              <div className="manage-goals-list">
                {visibleHabits.map((habit) => (
                  <article className="manage-goal-card" key={habit.id}>
                    <div className={`manage-icon-box ${habit.icon !== figma.running ? 'gradient-icon' : ''}`}>
                      <HabitIconMark icon={habit.icon} />
                    </div>
                    <div>
                      <h3>{habit.name}</h3>
                      <p>{habit.target} {habit.unit}</p>
                    </div>
                    <img className="more-icon" src={figma.manageMore} alt="" />
                  </article>
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
    <section className="screen">
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
