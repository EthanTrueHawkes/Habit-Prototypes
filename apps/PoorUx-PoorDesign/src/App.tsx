import { useRef, useState, type ReactNode } from 'react'
import './App.css'

import createHabitIcon from './assets/figma/create-habit.svg'
import createReminderIcon from './assets/figma/create-reminder.svg'
import habitActionDeleteIcon from './assets/figma/habit-action-delete.svg'
import habitActionResetIcon from './assets/figma/habit-action-reset.svg'
import habitActionSkipIcon from './assets/figma/habit-action-skip.svg'
import habitActionViewIcon from './assets/figma/habit-action-view.svg'
import habitBackIcon from './assets/figma/habit-back.svg'
import habitCheckIcon from './assets/figma/habit-check.svg'
import habitDropdownIcon from './assets/figma/habit-dropdown.svg'
import habitEditIcon from './assets/figma/habit-edit.svg'
import habitPopupPointer from './assets/figma/habit-popup-pointer.svg'
import habitRainbowImage from './assets/figma/habit-rainbow.png'
import habitReminderPlusIcon from './assets/figma/habit-reminder-plus.svg'
import habitSelectedColor from './assets/figma/habit-selected-color.svg'
import habitSheetCloseIcon from './assets/figma/habit-sheet-close.svg'
import clockIcon from './assets/figma/icon-clock.svg'
import plusIcon from './assets/figma/icon-plus.svg'
import manageDotsIcon from './assets/figma/manage-dots.svg'
import managePencilIcon from './assets/figma/manage-pencil.svg'
import managePlusIcon from './assets/figma/manage-plus.svg'
import menuCalendarIcon from './assets/figma/menu-calendar.svg'
import menuPencilIcon from './assets/figma/menu-pencil.svg'
import menuPlusIcon from './assets/figma/menu-plus.svg'
import menuStepIcon from './assets/figma/menu-step.svg'
import navExploreIcon from './assets/figma/nav-explore.svg'
import navManageIcon from './assets/figma/nav-manage.svg'
import navProgressIcon from './assets/figma/nav-progress.svg'
import navSettingsIcon from './assets/figma/nav-settings.svg'
import navTrackIcon from './assets/figma/nav-track.svg'
import settingsAppIcon from './assets/figma/settings-app.svg'
import settingsAppearanceIcon from './assets/figma/settings-appearance.svg'
import settingsArrowIcon from './assets/figma/settings-arrow.svg'
import settingsExternalIcon from './assets/figma/settings-external.svg'
import settingsFeedbackIcon from './assets/figma/settings-feedback.svg'
import settingsLogoutIcon from './assets/figma/settings-logout.svg'
import settingsMoonIcon from './assets/figma/settings-moon.svg'
import settingsNotificationIcon from './assets/figma/settings-notification.svg'
import settingsPrivacyIcon from './assets/figma/settings-privacy.svg'
import settingsTermsIcon from './assets/figma/settings-terms.svg'
import trackChevronIcon from './assets/figma/track-chevron.svg'
import trackEditIcon from './assets/figma/track-edit.svg'
import socialFastImage from './assets/figma/explore-social-fast.png'
import yogaImage from './assets/figma/explore-yoga.png'

type Page = 'explore' | 'track' | 'progress' | 'manage' | 'settings'
type Timeframe = 'daily' | 'weekly' | 'monthly'
type TrackOverlay = 'actions' | 'log' | null
type ManageFlow = 'list' | 'newHabit' | 'customHabit' | 'templateHabit'
type HabitPicker = 'category' | 'categoryCreate' | 'frequency' | 'unit' | 'reminder' | null

type Habit = {
  id: string
  title: string
  emoji: string
  value: number
  target: number
  unit: string
  timeframe: Timeframe
  description: string
  created?: boolean
  createdOn?: string
}

type ManageGoal = {
  id: string
  title: string
  emoji: string
  value: number
  target: number
  unit: string
}

const navItems: Array<{ id: Page; label: string; icon: string }> = [
  { id: 'explore', label: 'Explore', icon: navExploreIcon },
  { id: 'track', label: 'Track', icon: navTrackIcon },
  { id: 'progress', label: 'Progress', icon: navProgressIcon },
  { id: 'manage', label: 'Manage', icon: navManageIcon },
  { id: 'settings', label: 'Settings', icon: navSettingsIcon },
]

const tabLabels: Array<{ id: Timeframe; label: string }> = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

const initialHabits: Habit[] = [
  {
    id: 'running-1',
    title: 'Go Running',
    emoji: '🏃‍♀️',
    value: 1,
    target: 3,
    unit: 'miles',
    timeframe: 'daily',
    description: 'Go on a run each day for 3 miles. You got it!',
  },
  {
    id: 'read-a-book',
    title: 'Read a Book',
    emoji: '📚',
    value: 0,
    target: 30,
    unit: 'pages',
    timeframe: 'daily',
    description: 'Read a little more each day.',
    createdOn: '2026-06-10',
  },
]

const settingsGroups = [
  {
    title: 'General',
    rows: [
      { label: 'App Settings', icon: settingsAppIcon, action: 'chevron' },
      { label: 'Appearance', icon: settingsAppearanceIcon, action: 'appearance' },
      { label: 'Push Notifications', icon: settingsNotificationIcon, action: 'Enabled' },
    ],
  },
  {
    title: 'Terms',
    rows: [
      { label: 'Privacy Policy', icon: settingsPrivacyIcon, action: 'external' },
      { label: 'Terms & Conditions', icon: settingsTermsIcon, action: 'external' },
    ],
  },
  {
    title: 'Actions',
    rows: [
      { label: 'App Feedback', icon: settingsFeedbackIcon, action: 'chevron' },
      { label: 'Logout', icon: settingsLogoutIcon },
    ],
  },
]

const colorRows = [
  ['#97d7fa', '#b0ffbd', '#fbb6ed', '#f3dbae', '#f9b1b1', '#e0aaf9'],
  ['#4fb9f3', '#63e578', '#f17eda', '#efb74f', '#ec6a6a', '#c165eb'],
  ['#319dd8', '#2fd24a', '#cf35b0', '#c5902d', '#d23232', '#9e2ed1'],
  ['#156996', '#169f2c', '#901578', '#855d13', '#730e0e', '#681290'],
]

const newHabitTemplates = [
  {
    title: 'Exercise',
    habits: [
      { title: 'Go Running', detail: '4 miles', emoji: '\uD83C\uDFC3\u200D\u2640\uFE0F' },
      { title: 'Go Running', detail: '4 miles', emoji: '\uD83C\uDFC3\u200D\u2640\uFE0F' },
      { title: 'Go Running', detail: '4 miles', emoji: '\uD83C\uDFC3\u200D\u2640\uFE0F' },
      { title: 'Go Running', detail: '4 miles', emoji: '\uD83C\uDFC3\u200D\u2640\uFE0F' },
    ],
  },
  {
    title: 'Mind',
    habits: [
      { title: 'Meditate', detail: '15 minutes', emoji: '\uD83E\uDDD8\u200D\u2642\uFE0F' },
      { title: 'Meditate', detail: '15 minutes', emoji: '\uD83E\uDDD8\u200D\u2642\uFE0F' },
      { title: 'Meditate', detail: '15 minutes', emoji: '\uD83E\uDDD8\u200D\u2642\uFE0F' },
      { title: 'Meditate', detail: '15 minutes', emoji: '\uD83E\uDDD8\u200D\u2642\uFE0F' },
    ],
  },
]

const exploreImages = {
  dailyRun: 'https://images.unsplash.com/photo-1606934369778-3fb8d461404b?auto=format&fit=crop&w=800&q=80',
  drinkWater: 'https://img.buzzfeed.com/buzzfeed-static/static/2026-04/01/22/subbuzz/FJ5v27B3k.jpg',
  fruitBowl: 'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics/fruit_bowl_no_sugar.jpg',
  reading: 'https://images.unsplash.com/photo-1538036720156-a4ccde05446d?auto=format&fit=crop&w=800&q=80',
  languageStudy: 'https://static.fluentcap.live/assets/blog/why-learn-foreign-language-benefits/language-learning-cognitive-brain.png',
  journal: 'https://casolia.com/img/image12_lined-journal-ideas_memory-journal.jpg',
  makeBed: 'https://dairynutrition.ca/sites/dairynutrition/files/styles/full_width_large/public/iStock-1388450631_v2_0.jpg?itok=vU41X_l2',
  cleanDesk: 'https://images.unsplash.com/photo-1604504219246-6a4b59012b8f?auto=format&fit=crop&w=800&q=80',
  pushUps: 'https://images.unsplash.com/photo-1683192943220-d191b72a4fac?auto=format&fit=crop&w=800&q=80',
  weeklyPlanner: 'https://down-id.img.susercontent.com/file/sg-11134201-22120-ku2coel7dlkv81',
  mealPrep: 'https://modernmamaguides.com/wp-content/uploads/2025/12/storage-and-meal-prep-ideas-for-aesthetic-clean-eating-683x1024.jpeg',
  budget: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  longWalk: 'https://images.unsplash.com/photo-1672742648155-e95dda467c60?auto=format&fit=crop&fm=jpg&q=80&w=800',
  stretchClass: 'https://images.squarespace-cdn.com/content/v1/5d33937d5915f10001b19cfe/041fb53f-9983-4305-81d1-03344fa5b4c8/IMG_8693%2B2.JPG',
  sleepReview: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
  cleaning: 'https://www.vapelle.store/cdn/shop/files/Screenshot_2026-06-03_at_11.50.57_AM.png?v=1780505463&width=800',
  grocery: 'https://images.happycow.net/venues/1024/25/73/hcmp2573_3764665.jpeg',
  monthlyReview: 'https://simplementco.com/cdn/shop/files/Simplement-1_2.jpg?v=1700005069&width=900',
  photoBackup: 'https://assets.st-note.com/img/1762665154-WVGNYF85k2JpMSsPXdUzEoDr.png?width=900',
  healthCheck: 'https://images.unsplash.com/photo-1739285388427-d6f85d12a8fc?auto=format&fit=crop&fm=jpg&q=80&w=900',
  videoCall: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
}

const exploreContent: Record<
  Timeframe,
  {
    featured: { title: string; description: string; meta: string; image: string }
    sections: Array<{ title: string; habits: Array<{ title: string; meta: string; image: string }> }>
  }
> = {
  daily: {
    featured: {
      title: 'Social Media Fast',
      description: 'Go without any social media for 30 days',
      meta: 'Marked Daily',
      image: socialFastImage,
    },
    sections: [
      {
        title: 'Lifestyle',
        habits: [
          { title: 'Morning Yoga', meta: '30 minutes', image: yogaImage },
          { title: 'Drink Water', meta: '8 cups', image: exploreImages.drinkWater },
          { title: 'Go Running', meta: '4 miles', image: exploreImages.dailyRun },
        ],
      },
      {
        title: 'Abstinence',
        habits: [
          { title: 'Screen-Free Hour', meta: '1 hour', image: socialFastImage },
          { title: 'No Sugar', meta: '1 day', image: exploreImages.fruitBowl },
          { title: 'Skip Soda', meta: '8 cups', image: exploreImages.drinkWater },
        ],
      },
      {
        title: 'Learn',
        habits: [
          { title: 'Read a Book', meta: '20 pages', image: exploreImages.reading },
          { title: 'Practice Language', meta: '15 minutes', image: exploreImages.languageStudy },
          { title: 'Journal Notes', meta: '10 minutes', image: exploreImages.journal },
        ],
      },
      {
        title: 'Goals',
        habits: [
          { title: 'Make Bed', meta: '1 room', image: exploreImages.makeBed },
          { title: 'Clean Desk', meta: '10 minutes', image: exploreImages.cleanDesk },
          { title: 'Push Ups', meta: '20 reps', image: exploreImages.pushUps },
        ],
      },
    ],
  },
  weekly: {
    featured: {
      title: 'Weekly Reset',
      description: 'Review your week and choose one thing to improve',
      meta: 'Marked Weekly',
      image: exploreImages.weeklyPlanner,
    },
    sections: [
      {
        title: 'Planning',
        habits: [
          { title: 'Meal Prep', meta: '2 hours', image: exploreImages.mealPrep },
          { title: 'Plan Week', meta: '45 minutes', image: exploreImages.weeklyPlanner },
          { title: 'Budget Check', meta: '20 minutes', image: exploreImages.budget },
        ],
      },
      {
        title: 'Wellness',
        habits: [
          { title: 'Long Walk', meta: '5 miles', image: exploreImages.longWalk },
          { title: 'Stretch Class', meta: '60 minutes', image: exploreImages.stretchClass },
          { title: 'Sleep Review', meta: '15 minutes', image: exploreImages.sleepReview },
        ],
      },
      {
        title: 'Home',
        habits: [
          { title: 'Clean Room', meta: '1 room', image: exploreImages.cleaning },
          { title: 'Laundry', meta: '2 loads', image: exploreImages.cleaning },
          { title: 'Grocery Run', meta: '1 trip', image: exploreImages.grocery },
        ],
      },
    ],
  },
  monthly: {
    featured: {
      title: 'Digital Declutter',
      description: 'Clear old files, photos, and subscriptions once a month',
      meta: 'Marked Monthly',
      image: exploreImages.photoBackup,
    },
    sections: [
      {
        title: 'Money',
        habits: [
          { title: 'Pay Bills', meta: '1 session', image: exploreImages.budget },
          { title: 'Savings Review', meta: '30 minutes', image: exploreImages.budget },
          { title: 'Cancel Extras', meta: '15 minutes', image: exploreImages.videoCall },
        ],
      },
      {
        title: 'Reflection',
        habits: [
          { title: 'Monthly Review', meta: '45 minutes', image: exploreImages.monthlyReview },
          { title: 'Set Goals', meta: '3 goals', image: exploreImages.monthlyReview },
          { title: 'Photo Backup', meta: '1 archive', image: exploreImages.photoBackup },
        ],
      },
      {
        title: 'Care',
        habits: [
          { title: 'Deep Clean', meta: '2 hours', image: exploreImages.cleaning },
          { title: 'Health Check', meta: '1 appointment', image: exploreImages.healthCheck },
          { title: 'Call Family', meta: '3 calls', image: exploreImages.videoCall },
        ],
      },
    ],
  },
}

type HabitFormState = {
  emoji: string
  title: string
  description: string
  category: string
  goodForYou: 'yes' | 'no' | null
  frequency: Timeframe | ''
  target: string
  unit: string
  memoRequired: 'yes' | 'no' | null
  reminderName: string
  reminderTime: string
  reminderSound: string
}

const customHabitForm: HabitFormState = {
  emoji: '',
  title: '',
  description: '',
  category: '',
  goodForYou: null,
  frequency: '',
  target: '',
  unit: 'Miles',
  memoRequired: null,
  reminderName: '',
  reminderTime: '12:00 PM',
  reminderSound: 'Chirp',
}

const templateHabitForm: HabitFormState = {
  emoji: '\uD83C\uDFC3\u200D\u2640\uFE0F',
  title: 'Go Running',
  description: 'Go running each day for 1 mile.',
  category: '',
  goodForYou: 'yes',
  frequency: 'daily',
  target: '1',
  unit: 'Miles',
  memoRequired: 'no',
  reminderName: '',
  reminderTime: '12:00 PM',
  reminderSound: 'Chirp',
}

const unitOptions = ['Done', 'Times', 'Miles', 'Pages', 'Minutes', 'Hours', 'Cups', 'Custom']
const frequencyOptions: Array<{ label: string; value: Timeframe }> = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

const TRACK_YEAR = 2026
const TRACK_TODAY = { year: TRACK_YEAR, monthIndex: 5, day: 10 }
const TRACK_TODAY_KEY = toDateKey(TRACK_TODAY.year, TRACK_TODAY.monthIndex, TRACK_TODAY.day)
const TRACK_MONTH_RANGE = { min: 2, max: 8 }
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September']
const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type TrackDateParts = {
  year: number
  monthIndex: number
  day: number
}

type HabitHistory = Record<string, Record<string, number>>

function App() {
  const [activePage, setActivePage] = useState<Page>('explore')
  const [timeframes, setTimeframes] = useState<Record<Page, Timeframe>>({
    explore: 'daily',
    track: 'daily',
    progress: 'daily',
    manage: 'daily',
    settings: 'daily',
  })
  const [habits, setHabits] = useState(initialHabits)
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
  const [trackOverlay, setTrackOverlay] = useState<TrackOverlay>(null)
  const [logValue, setLogValue] = useState('0')
  const [detailHabitId, setDetailHabitId] = useState<string | null>(null)
  const [trackMenuOpen, setTrackMenuOpen] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const [manageFlow, setManageFlow] = useState<ManageFlow>('list')
  const [habitPicker, setHabitPicker] = useState<HabitPicker>(null)
  const [habitForm, setHabitForm] = useState<HabitFormState>(customHabitForm)
  const [newCategoryValue, setNewCategoryValue] = useState('')
  const [trackDateKey, setTrackDateKey] = useState(TRACK_TODAY_KEY)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(TRACK_TODAY.monthIndex)
  const [calendarDraftDateKey, setCalendarDraftDateKey] = useState(TRACK_TODAY_KEY)
  const [habitHistory, setHabitHistory] = useState<HabitHistory>({})
  const [templateReturnPage, setTemplateReturnPage] = useState<Page | null>(null)

  const activeTimeframe = timeframes[activePage]
  const isTrackToday = trackDateKey === TRACK_TODAY_KEY
  const trackDateLabel = isTrackToday ? '' : formatTrackDateLabel(trackDateKey)
  const selectedHabit = habits.find((habit) => habit.id === selectedHabitId) ?? null
  const detailHabit = habits.find((habit) => habit.id === detailHabitId) ?? null
  const progressGoals: ManageGoal[] = habits
    .filter((habit) => habit.timeframe === activeTimeframe)
    .map((habit) => ({
      id: habit.id,
      title: habit.title,
      emoji: habit.emoji,
      value: habit.value,
      target: habit.target,
      unit: habit.unit,
    }))
  const isDetailOpen = detailHabitId !== null && detailHabit !== null

  const setTimeframe = (timeframe: Timeframe) => {
    setTimeframes((current) => ({ ...current, [activePage]: timeframe }))
    setTrackOverlay(null)
    setCalendarOpen(false)
  }

  const goToPage = (page: Page) => {
    setActivePage(page)
    setManageFlow('list')
    setTemplateReturnPage(null)
    setHabitPicker(null)
    setDetailHabitId(null)
    setSelectedHabitId(null)
    setTrackOverlay(null)
    setTrackMenuOpen(false)
    setCreateMenuOpen(false)
    setCalendarOpen(false)
  }

  const openHabitActions = (habitId: string) => {
    setSelectedHabitId(habitId)
    setTrackOverlay('actions')
    setCalendarOpen(false)
  }

  const openLogProgress = (habit: Habit) => {
    setSelectedHabitId(habit.id)
    setLogValue(String(habit.value))
    setTrackOverlay('log')
    setCalendarOpen(false)
  }

  const saveLogProgress = () => {
    if (!selectedHabit) return
    const nextValue = Math.max(0, Number.parseInt(logValue || '0', 10) || 0)
    if (isTrackToday) {
      setHabits((current) =>
        current.map((habit) => (habit.id === selectedHabit.id ? { ...habit, value: nextValue } : habit)),
      )
    } else {
      setHabitHistory((current) => ({
        ...current,
        [trackDateKey]: {
          ...(current[trackDateKey] ?? {}),
          [selectedHabit.id]: nextValue,
        },
      }))
    }
    setTrackOverlay(null)
  }

  const resetHabit = () => {
    if (!selectedHabit) return
    if (isTrackToday) {
      setHabits((current) => current.map((habit) => (habit.id === selectedHabit.id ? { ...habit, value: 0 } : habit)))
    } else {
      setHabitHistory((current) => ({
        ...current,
        [trackDateKey]: {
          ...(current[trackDateKey] ?? {}),
          [selectedHabit.id]: 0,
        },
      }))
    }
    setTrackOverlay(null)
  }

  const deleteHabit = () => {
    if (!selectedHabit) return
    setHabits((current) => current.filter((habit) => habit.id !== selectedHabit.id))
    setSelectedHabitId(null)
    setTrackOverlay(null)
  }

  const viewHabit = () => {
    if (!selectedHabit) return
    setDetailHabitId(selectedHabit.id)
    setTrackOverlay(null)
  }

  const updateHabitTimeframe = (habitId: string, timeframe: Timeframe) => {
    setHabits((current) => current.map((habit) => (habit.id === habitId ? { ...habit, timeframe } : habit)))
    setTimeframes((current) => ({ ...current, track: timeframe, progress: timeframe, manage: timeframe }))
  }

  const openTrackCalendar = () => {
    const currentTrackDate = parseDateKey(trackDateKey)
    setCalendarMonthIndex(currentTrackDate.monthIndex)
    setCalendarDraftDateKey(trackDateKey)
    setCalendarOpen(true)
    setTrackMenuOpen(false)
    setTrackOverlay(null)
  }

  const selectTrackCalendarDay = () => {
    setTrackDateKey(calendarDraftDateKey)
    setSelectedHabitId(null)
    setTrackOverlay(null)
  }

  const openNewHabitFlow = () => {
    setHabitForm(customHabitForm)
    setManageFlow('newHabit')
    setTrackMenuOpen(false)
    setCreateMenuOpen(false)
    setTrackOverlay(null)
    setCalendarOpen(false)
    setHabitPicker(null)
  }

  const openCustomHabit = () => {
    setHabitForm(customHabitForm)
    setManageFlow('customHabit')
    setHabitPicker(null)
  }

  const openTemplateHabit = () => {
    setHabitForm(templateHabitForm)
    setManageFlow('templateHabit')
    setHabitPicker(null)
  }

  const openTemplateHabitFromExplore = () => {
    setTemplateReturnPage('explore')
    setHabitForm(templateHabitForm)
    setManageFlow('templateHabit')
    setHabitPicker(null)
  }

  const backFromHabitForm = () => {
    if (templateReturnPage) {
      setManageFlow('list')
      setHabitPicker(null)
      setActivePage(templateReturnPage)
      setTemplateReturnPage(null)
      return
    }

    setManageFlow('newHabit')
    setHabitPicker(null)
  }

  const updateHabitForm = (updates: Partial<HabitFormState>) => {
    setHabitForm((current) => ({ ...current, ...updates }))
  }

  const saveCategory = () => {
    const nextCategory = newCategoryValue.trim()
    if (!nextCategory) return
    updateHabitForm({ category: nextCategory })
    setNewCategoryValue('')
    setHabitPicker('category')
  }

  const continueHabitFlow = () => {
    const target = Math.max(1, Number.parseInt(habitForm.target || '1', 10) || 1)
    const unit = habitForm.unit || 'Miles'
    const title = habitForm.title.trim() || 'Custom Habit'
    const emoji = habitForm.emoji || '\u2705'
    const timeframe = habitForm.frequency || 'daily'

    setHabits((current) => [
      ...current,
      {
        id: `created-${Date.now()}`,
        title,
        emoji,
        value: 0,
        target,
        unit: unit.toLowerCase(),
        timeframe,
        description: habitForm.description || `${title} each day.`,
        created: true,
        createdOn: TRACK_TODAY_KEY,
      },
    ])
    setTimeframes((current) => ({ ...current, manage: timeframe, track: timeframe }))
    setManageFlow('list')
    setHabitPicker(null)
    setActivePage('manage')
  }

  if (manageFlow !== 'list') {
    return (
      <main className="phone-shell">
        <div className="phone-frame">
          {manageFlow === 'newHabit' && (
            <NewHabitPage
              onBack={() => setManageFlow('list')}
              onExplore={() => goToPage('explore')}
              onCustomHabit={openCustomHabit}
              onTemplateHabit={openTemplateHabit}
            />
          )}
          {(manageFlow === 'customHabit' || manageFlow === 'templateHabit') && (
            <ManageHabitFormPage
              form={habitForm}
              isTemplate={manageFlow === 'templateHabit'}
              picker={habitPicker}
              newCategoryValue={newCategoryValue}
              onBack={backFromHabitForm}
              onExplore={() => goToPage('explore')}
              onChange={updateHabitForm}
              onPickerChange={setHabitPicker}
              onNewCategoryChange={setNewCategoryValue}
              onSaveCategory={saveCategory}
              onContinue={continueHabitFlow}
            />
          )}
        </div>
      </main>
    )
  }

  if (isDetailOpen) {
    return (
      <main className="phone-shell">
        <div className="phone-frame">
          <IndividualHabitPage
            habit={detailHabit}
            onBack={() => setDetailHabitId(null)}
            onTimeframeChange={(timeframe) => updateHabitTimeframe(detailHabit.id, timeframe)}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="phone-shell">
      <div className="phone-frame">
        {activePage === 'settings' ? (
          <SettingsPage />
        ) : (
          <>
            <AppHeader
              page={activePage}
              trackDateLabel={activePage === 'track' ? trackDateLabel : ''}
              timeframe={activeTimeframe}
              onTimeframeChange={setTimeframe}
              onTrackMenu={() => {
                setTrackMenuOpen((open) => !open)
                setCreateMenuOpen(false)
                setTrackOverlay(null)
                setCalendarOpen(false)
              }}
              onCreateMenu={() => {
                setCreateMenuOpen((open) => !open)
                setTrackMenuOpen(false)
                setTrackOverlay(null)
                setCalendarOpen(false)
              }}
            />
            {activePage === 'explore' && <ExplorePage timeframe={activeTimeframe} onTemplateHabit={openTemplateHabitFromExplore} />}
            {activePage === 'track' && (
              <TrackPage
                habits={habits}
                history={habitHistory}
                selectedDateKey={trackDateKey}
                timeframe={activeTimeframe}
                onHabitPress={openHabitActions}
                onProgressPress={openLogProgress}
              />
            )}
            {activePage === 'progress' && <ProgressPage goals={progressGoals} />}
            {activePage === 'manage' && <ManagePage timeframe={activeTimeframe} habits={habits} />}
            {trackMenuOpen && activePage === 'track' && (
              <DismissLayer className="menu-dismiss-layer" onClose={() => setTrackMenuOpen(false)}>
                <TrackMenu onAddHabit={openNewHabitFlow} onChangeDay={openTrackCalendar} />
              </DismissLayer>
            )}
            {calendarOpen && activePage === 'track' && (
              <DismissLayer className="calendar-dismiss-layer" onClose={() => setCalendarOpen(false)}>
                <TrackCalendarPopup
                  draftDateKey={calendarDraftDateKey}
                  monthIndex={calendarMonthIndex}
                  onMonthChange={setCalendarMonthIndex}
                  onSelectDay={setCalendarDraftDateKey}
                  onSelectDayConfirm={selectTrackCalendarDay}
                  selectedTrackDateKey={trackDateKey}
                />
              </DismissLayer>
            )}
            {createMenuOpen && activePage === 'manage' && (
              <DismissLayer className="menu-dismiss-layer" onClose={() => setCreateMenuOpen(false)}>
                <CreateMenu onCreateHabit={openNewHabitFlow} />
              </DismissLayer>
            )}
            {trackOverlay === 'actions' && selectedHabit && (
              <DismissLayer className="action-dismiss-layer" onClose={() => setTrackOverlay(null)}>
                <HabitActions onView={viewHabit} onReset={resetHabit} onSkip={() => setTrackOverlay(null)} onDelete={deleteHabit} />
              </DismissLayer>
            )}
            {trackOverlay === 'log' && selectedHabit && (
              <DismissLayer className="sheet-dismiss-layer" onClose={() => setTrackOverlay(null)}>
                <HabitLogSheet
                  habit={selectedHabit}
                  value={logValue}
                  onChange={setLogValue}
                  onClose={() => setTrackOverlay(null)}
                  onSave={saveLogProgress}
                />
              </DismissLayer>
            )}
          </>
        )}
        <BottomNav activePage={activePage} onChange={goToPage} />
      </div>
    </main>
  )
}

type HeaderProps = {
  page: Page
  trackDateLabel?: string
  timeframe: Timeframe
  onTimeframeChange: (timeframe: Timeframe) => void
  onTrackMenu: () => void
  onCreateMenu: () => void
}

function AppHeader({
  page,
  trackDateLabel = '',
  timeframe,
  onTimeframeChange,
  onTrackMenu,
  onCreateMenu,
}: HeaderProps) {
  return (
    <header className={trackDateLabel ? 'app-header has-track-date' : 'app-header'}>
      {page === 'track' && (
        <button className="header-square header-left" type="button" onClick={onTrackMenu} aria-label="Open menu">
          <span className="hamburger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      )}
      {page === 'manage' && (
        <button className="header-square header-left" type="button" aria-label="Edit">
          <img className="manage-header-pencil" src={managePencilIcon} alt="" />
        </button>
      )}
      {page === 'manage' && (
        <button className="header-square header-right" type="button" onClick={onCreateMenu} aria-label="Create new">
          <img className="manage-header-plus" src={managePlusIcon} alt="" />
        </button>
      )}
      <h1>{pageLabel(page)}</h1>
      {trackDateLabel && <p className="track-header-date">{trackDateLabel}</p>}
      <TimeframeTabs active={timeframe} onChange={onTimeframeChange} />
    </header>
  )
}

function SettingsHeader() {
  return (
    <header className="settings-header">
      <h1>Settings</h1>
    </header>
  )
}

function TimeframeTabs({
  active,
  onChange,
}: {
  active: Timeframe
  onChange: (timeframe: Timeframe) => void
}) {
  return (
    <div className="timeframe-tabs" data-active={active}>
      {tabLabels.map((tab) => (
        <button
          className={tab.id === active ? 'active' : ''}
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function BottomNav({
  activePage,
  onChange,
}: {
  activePage: Page
  onChange: (page: Page) => void
}) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map((item) => (
        <button
          className={item.id === activePage ? 'active' : ''}
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
        >
          <img src={item.icon} alt="" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function DismissLayer({
  children,
  className = '',
  onClose,
}: {
  children: ReactNode
  className?: string
  onClose: () => void
}) {
  return (
    <div className={`dismiss-layer ${className}`} onClick={onClose}>
      <div className="dismiss-layer-content" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function ExplorePage({ timeframe, onTemplateHabit }: { timeframe: Timeframe; onTemplateHabit: () => void }) {
  const content = exploreContent[timeframe]

  return (
    <div className="content-scroll explore-page">
      <section className="explore-section featured-section">
        <h2>Featured</h2>
        <article className="feature-card">
          <img src={content.featured.image} alt="" />
          <div className="image-scrim" />
          <button className="add-chip square" type="button" aria-label={`Add ${content.featured.title}`}>
            <img src={plusIcon} alt="" />
          </button>
          <div className="feature-copy">
            <h3>{content.featured.title}</h3>
            <p>{content.featured.description}</p>
          </div>
          <div className="meta-line">
            <img src={clockIcon} alt="" />
            <span>{content.featured.meta}</span>
          </div>
        </article>
      </section>
      {content.sections.map((section) => (
        <section className="explore-section" key={section.title}>
          <h2>{section.title}</h2>
          <div className="card-row">
            {section.habits.map((habit) => (
              <HabitImageCard
                key={`${section.title}-${habit.title}`}
                image={habit.image}
                title={habit.title}
                meta={habit.meta}
                onClick={timeframe === 'daily' && habit.title === 'Go Running' ? onTemplateHabit : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function HabitImageCard({ image, title, meta, onClick }: { image: string; title: string; meta: string; onClick?: () => void }) {
  const isClickable = Boolean(onClick)

  return (
    <article
      className={isClickable ? 'habit-image-card clickable' : 'habit-image-card'}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) return
        event.preventDefault()
        onClick()
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <img src={image} alt="" />
      <div className="image-scrim" />
      <button
        className="add-chip rounded"
        type="button"
        aria-label={`Add ${title}`}
        onClick={(event) => {
          if (!onClick) return
          event.stopPropagation()
          onClick()
        }}
      >
        <img src={plusIcon} alt="" />
      </button>
      <h3>{title}</h3>
      <div className="meta-line">
        <img src={clockIcon} alt="" />
        <span>{meta}</span>
      </div>
    </article>
  )
}

function TrackPage({
  habits,
  history,
  selectedDateKey,
  timeframe,
  onHabitPress,
  onProgressPress,
}: {
  habits: Habit[]
  history: HabitHistory
  selectedDateKey: string
  timeframe: Timeframe
  onHabitPress: (habitId: string) => void
  onProgressPress: (habit: Habit) => void
}) {
  const visibleHabits = habits
    .filter((habit) => habit.timeframe === timeframe && habitExistsOnDate(habit, selectedDateKey))
    .map((habit) => ({
      ...habit,
      value: getHabitValueForDate(habit, selectedDateKey, history),
    }))

  return (
    <div className="content-scroll track-page">
      {visibleHabits.length > 0 && (
        <section className="track-group">
          <div className="group-heading">
            <span>Fitness</span>
            <img src={trackChevronIcon} alt="" />
          </div>
          {visibleHabits.map((habit) => (
            <TrackHabitRow
              habit={habit}
              key={habit.id}
              onHabitPress={() => onHabitPress(habit.id)}
              onProgressPress={() => onProgressPress(habit)}
            />
          ))}
        </section>
      )}
    </div>
  )
}

function TrackHabitRow({
  habit,
  onHabitPress,
  onProgressPress,
}: {
  habit: Habit
  onHabitPress: () => void
  onProgressPress: () => void
}) {
  return (
    <article className="track-row">
      <button className="track-row-main" type="button" onClick={onHabitPress} aria-label={`Open actions for ${habit.title}`}>
        <span className="emoji-box">{habit.emoji}</span>
        <span className="habit-title-block">
          <span className="habit-row-title">{habit.title}</span>
          <span className="habit-row-detail">
            {habit.value}/{habit.target} {habit.unit}
          </span>
        </span>
        <span className="progress-track">
          <span style={{ width: `${Math.min(1, habit.value / habit.target) * 365}px` }} />
        </span>
      </button>
      <button className="row-icon-button" type="button" onClick={onProgressPress} aria-label={`Log progress for ${habit.title}`}>
        <img src={trackEditIcon} alt="" />
      </button>
    </article>
  )
}

function TrackCalendarPopup({
  draftDateKey,
  monthIndex,
  onMonthChange,
  onSelectDay,
  onSelectDayConfirm,
  selectedTrackDateKey,
}: {
  draftDateKey: string
  monthIndex: number
  onMonthChange: (monthIndex: number) => void
  onSelectDay: (dateKey: string) => void
  onSelectDayConfirm: () => void
  selectedTrackDateKey: string
}) {
  const calendarDays = buildCalendarDays(TRACK_YEAR, monthIndex)
  const canGoPrevious = monthIndex > TRACK_MONTH_RANGE.min
  const canGoNext = monthIndex < TRACK_MONTH_RANGE.max
  const showSelectButton = draftDateKey !== selectedTrackDateKey

  return (
    <section className={showSelectButton ? 'track-calendar-popup has-selection' : 'track-calendar-popup'} aria-label="Track calendar">
      <div className="track-calendar-header">
        <button
          className={!canGoPrevious ? 'disabled' : ''}
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onMonthChange(monthIndex - 1)}
          aria-label="Previous month"
        >
          <img src={habitDropdownIcon} alt="" />
        </button>
        <h2>{monthNames[monthIndex]}</h2>
        <button
          className={!canGoNext ? 'disabled' : ''}
          type="button"
          disabled={!canGoNext}
          onClick={() => onMonthChange(monthIndex + 1)}
          aria-label="Next month"
        >
          <img src={habitDropdownIcon} alt="" />
        </button>
      </div>
      <div className="track-calendar-grid">
        {weekdayNames.map((day) => (
          <div className="calendar-weekday" key={day}>
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          if (!day) return <span className="calendar-day-cell empty" key={`empty-${index}`} />

          const dateKey = toDateKey(TRACK_YEAR, monthIndex, day)
          const isFuture = dateKey > TRACK_TODAY_KEY
          const isSelected = dateKey === draftDateKey

          return (
            <button
              className={`${isSelected ? 'calendar-day-cell selected' : 'calendar-day-cell'}${isFuture ? ' future' : ''}`}
              key={dateKey}
              type="button"
              disabled={isFuture}
              onClick={() => onSelectDay(dateKey)}
              aria-label={`${monthNames[monthIndex]} ${day}`}
            >
              {day}
            </button>
          )
        })}
      </div>
      {showSelectButton && (
        <button className="select-track-day-button" type="button" onClick={onSelectDayConfirm}>
          Select Day
        </button>
      )}
    </section>
  )
}

function HabitActions({
  onView,
  onReset,
  onSkip,
  onDelete,
}: {
  onView: () => void
  onReset: () => void
  onSkip: () => void
  onDelete: () => void
}) {
  return (
    <div className="habit-action-tray">
      <img className="habit-action-pointer" src={habitPopupPointer} alt="" />
      <div className="habit-action-panel">
        <HabitActionButton icon={habitActionViewIcon} label="View" onClick={onView} />
        <HabitActionButton icon={habitActionResetIcon} label="Reset" onClick={onReset} />
        <HabitActionButton icon={habitActionSkipIcon} label="Skip" onClick={onSkip} />
        <HabitActionButton icon={habitActionDeleteIcon} label="Delete" destructive onClick={onDelete} />
      </div>
    </div>
  )
}

function HabitActionButton({
  icon,
  label,
  destructive = false,
  onClick,
}: {
  icon: string
  label: string
  destructive?: boolean
  onClick: () => void
}) {
  return (
    <button className={destructive ? 'habit-action-button destructive' : 'habit-action-button'} type="button" onClick={onClick}>
      <img src={icon} alt="" />
      <span>{label}</span>
    </button>
  )
}

function HabitLogSheet({
  habit,
  value,
  onChange,
  onClose,
  onSave,
}: {
  habit: Habit
  value: string
  onChange: (value: string) => void
  onClose: () => void
  onSave: () => void
}) {
  const valueInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="habit-log-sheet">
      <div className="sheet-grabber" />
      <button className="sheet-close-button" type="button" onClick={onClose} aria-label="Close log progress">
        <img src={habitSheetCloseIcon} alt="" />
      </button>
      <h2>Log Progress</h2>
      <button className="sheet-save-button" type="button" onClick={onSave}>
        Save
      </button>
      <div className="log-field-block">
        <label htmlFor="habit-log-value">Value:</label>
        <div className="log-value-row" onClick={() => valueInputRef.current?.focus()}>
          <input
            id="habit-log-value"
            ref={valueInputRef}
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
            aria-label={`Value of ${habit.target}`}
          />
          <span>of {habit.target}</span>
        </div>
      </div>
    </div>
  )
}

function ProgressPage({ goals }: { goals: ManageGoal[] }) {
  const finishedGoals = goals.filter((goal) => goal.value >= goal.target).length
  const bestGoal = goals.length
    ? goals.reduce((best, goal) => (goal.value / goal.target > best.value / best.target ? goal : best))
    : null
  const completionRate = Math.round(
    goals.length ? (goals.reduce((total, goal) => total + Math.min(1, goal.value / goal.target), 0) / goals.length) * 100 : 0,
  )
  const rings = [
    ['🏃‍♀️', '1/2'],
    ['🚴‍♂️', '2/2'],
    ['🧘‍♂️', '3/4'],
    ['🏊‍♀️', '4/4'],
    ['🛹', '1/2'],
    ['⛹️‍♀️', '2/2'],
    ['🤸‍♂️', '3/4'],
    ['🥋', '4/4'],
  ]

  void rings

  return (
    <div className="content-scroll progress-page">
      <section className="progress-summary">
        <div className="summary-line">
          <span>Goals Finished</span>
          <span>
            {finishedGoals} of {goals.length}
          </span>
        </div>
        <div className="summary-bar">
          <span style={{ width: `${goals.length ? (finishedGoals / goals.length) * 329 : 0}px` }} />
        </div>
        <div className="summary-cards">
          <MetricCard
            label="Best Goal"
            value={bestGoal?.title ?? 'None'}
            suffix={bestGoal?.unit ?? ''}
            progress={bestGoal ? bestGoal.value / bestGoal.target : 0}
          />
          <MetricCard label="Completion Rate" value={`${completionRate}%`} suffix="%" progress={completionRate / 100} />
        </div>
      </section>
      <section className="goals-breakdown">
        <h2>Goals Breakdown</h2>
        <div className="ring-grid">
          {goals.map((goal) => (
            <ProgressRing goal={goal} key={goal.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  suffix,
  progress,
}: {
  label: string
  value: string
  suffix: string
  progress: number
}) {
  const width = Math.min(1, Math.max(0, progress)) * 146

  return (
    <article className="metric-card">
      <p>{label}</p>
      <h3>{value}</h3>
      <div className="metric-scale">
        <span style={{ width: `${width}px` }} />
      </div>
      <div className="metric-labels">
        <span>0 {suffix}</span>
        <span>{suffix === '%' ? '100' : ''}</span>
      </div>
    </article>
  )
}

function ProgressRing({ goal }: { goal: ManageGoal }) {
  const ratio = Math.min(1, Math.max(0, goal.value / goal.target))
  const progressDegrees = ratio * 360

  return (
    <div className="ring-item">
      <div
        className="ring-art"
        style={{
          background: `conic-gradient(var(--accent) 0deg ${progressDegrees}deg, #8aa2b1 ${progressDegrees}deg 360deg)`,
        }}
      >
        <span>{goal.emoji}</span>
      </div>
      <strong>
        {goal.value}/{goal.target}
      </strong>
    </div>
  )
}

function ManagePage({ timeframe, habits }: { timeframe: Timeframe; habits: Habit[] }) {
  const visibleHabits = habits.filter((habit) => habit.timeframe === timeframe)

  return (
    <div className="content-scroll manage-page" data-goal-count={visibleHabits.length}>
      <section className="manage-section">
        <h2>Goals</h2>
        {visibleHabits.map((habit) => (
          <ManageGoalRow
            detail={`${habit.target} ${habit.unit}`}
            emoji={habit.emoji}
            key={habit.id}
            title={habit.title}
          />
        ))}
      </section>
      {timeframe === 'daily' && (
        <section className="manage-section reminders-section">
          <h2>Reminders</h2>
          <ReminderRow />
        </section>
      )}
    </div>
  )
}

function ManageGoalRow({
  emoji,
  title,
  detail,
}: {
  emoji: string
  title: string
  detail: string
}) {
  return (
    <article className="manage-row">
      <div className="emoji-box">{emoji}</div>
      <div className="habit-title-block">
        <h2>{title}</h2>
        <p>{detail}</p>
      </div>
      <button className="row-icon-button" type="button" aria-label={`More options for ${title}`}>
        <img className="manage-dots-icon" src={manageDotsIcon} alt="" />
      </button>
    </article>
  )
}

function ReminderRow() {
  const [enabled, setEnabled] = useState(true)

  return (
    <article className="reminder-row">
      <div className="reminder-time">
        <span>4:00</span>
        <strong>AM</strong>
      </div>
      <span className="reminder-frequency">Everyday</span>
      <p>Don’t forget today’s goals.</p>
      <button
        aria-label={enabled ? 'Reminder enabled' : 'Reminder disabled'}
        aria-pressed={enabled}
        className={enabled ? 'toggle-on' : 'toggle-on off'}
        type="button"
        onClick={() => setEnabled((current) => !current)}
      >
        <span />
      </button>
    </article>
  )
}

function NewHabitPage({
  onBack,
  onExplore,
  onCustomHabit,
  onTemplateHabit,
}: {
  onBack: () => void
  onExplore: () => void
  onCustomHabit: () => void
  onTemplateHabit: () => void
}) {
  return (
    <div className="manage-flow-screen">
      <NewHabitHeader onBack={onBack} onExplore={onExplore} />
      <div className="new-habit-list">
        {newHabitTemplates.map((group) => (
          <section className="new-template-section" key={group.title}>
            <h2>{group.title}</h2>
            {group.habits.map((habit, index) => (
              <NewHabitTemplateRow
                detail={habit.detail}
                emoji={habit.emoji}
                key={`${group.title}-${index}`}
                onClick={group.title === 'Exercise' && index === 0 ? onTemplateHabit : undefined}
                title={habit.title}
              />
            ))}
          </section>
        ))}
      </div>
      <button className="new-habit-sticky-button" type="button" onClick={onCustomHabit}>
        <span aria-hidden="true">+</span>
        <strong>Custom Habit</strong>
      </button>
    </div>
  )
}

function NewHabitHeader({ onBack, onExplore }: { onBack: () => void; onExplore: () => void }) {
  return (
    <header className="new-habit-header">
      <div className="new-habit-header-row">
        <button type="button" onClick={onBack} aria-label="Back to Manage">
          <img src={habitBackIcon} alt="" />
        </button>
        <h1>New Habit</h1>
        <button type="button" onClick={onExplore} aria-label="Go to Explore">
          <img className="new-habit-explore-icon" src={navExploreIcon} alt="" />
        </button>
      </div>
    </header>
  )
}

function NewHabitTemplateRow({
  emoji,
  title,
  detail,
  onClick,
}: {
  emoji: string
  title: string
  detail: string
  onClick?: () => void
}) {
  return (
    <button className="new-template-row" type="button" onClick={onClick} aria-label={`Open ${title}`}>
      <span className="emoji-box">{emoji}</span>
      <span className="habit-title-block">
        <span className="habit-row-title">{title}</span>
        <span className="habit-row-detail">{detail}</span>
      </span>
      <img src={habitDropdownIcon} alt="" />
    </button>
  )
}

function ManageHabitFormPage({
  form,
  isTemplate,
  picker,
  newCategoryValue,
  onBack,
  onExplore,
  onChange,
  onPickerChange,
  onNewCategoryChange,
  onSaveCategory,
  onContinue,
}: {
  form: HabitFormState
  isTemplate: boolean
  picker: HabitPicker
  newCategoryValue: string
  onBack: () => void
  onExplore: () => void
  onChange: (updates: Partial<HabitFormState>) => void
  onPickerChange: (picker: HabitPicker) => void
  onNewCategoryChange: (value: string) => void
  onSaveCategory: () => void
  onContinue: () => void
}) {
  const frequencyLabel = form.frequency ? capitalize(form.frequency) : 'Frequency'

  return (
    <div className="manage-flow-screen">
      <NewHabitHeader onBack={onBack} onExplore={onExplore} />
      <div className="habit-detail-content manage-habit-form">
        <section className="habit-edit-section">
          <h2>General</h2>
          <div className="habit-name-row">
            <label className={form.emoji ? 'habit-detail-emoji form-emoji-field' : 'habit-detail-emoji form-emoji-field placeholder'}>
              {form.emoji || <span>☺</span>}
              <input
                aria-label="Habit emoji"
                value={form.emoji}
                onChange={(event) => onChange({ emoji: event.target.value.slice(0, 4) })}
              />
            </label>
            <label className="habit-name-field form-text-field">
              <input
                aria-label="Habit name"
                placeholder="Name"
                value={form.title}
                onChange={(event) => onChange({ title: event.target.value })}
              />
            </label>
          </div>
          <p className="habit-note">
            <span>Note: Be Specific.</span>
            <a href="#tips">Consider These Tips!</a>
          </p>
          <label className="habit-description-box form-description-field">
            <textarea
              aria-label="Habit description"
              maxLength={150}
              placeholder="Long description of habit. Why are you doing this? What is its purpose?"
              value={form.description}
              onChange={(event) => onChange({ description: event.target.value })}
            />
            <span>{form.description.length}/150</span>
          </label>
        </section>

        <HabitColorSection />

        <FormSelectSection
          title="What category is this habit?"
          value={form.category || 'Category'}
          muted={!form.category}
          onClick={() => onPickerChange('category')}
        />

        <section className="habit-edit-section">
          <h2>{`Is {Selected Habit} good for you?`}</h2>
          <div className="radio-block">
            <button className="radio-row" type="button" onClick={() => onChange({ goodForYou: 'yes' })}>
              <RadioDot checked={form.goodForYou === 'yes'} />
              <span>Yes</span>
            </button>
            <button className="radio-row" type="button" onClick={() => onChange({ goodForYou: 'no' })}>
              <RadioDot checked={form.goodForYou === 'no'} />
              <span>No</span>
            </button>
          </div>
        </section>

        <FormSelectSection
          title="How frequent is this habit?"
          value={frequencyLabel}
          muted={!form.frequency}
          onClick={() => onPickerChange('frequency')}
        />

        <section className="habit-edit-section">
          <h2>Occurance</h2>
          <div className={isTemplate ? 'occurrence-row all-selected' : 'occurrence-row'}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span className={!isTemplate && index === 0 ? 'muted' : ''} key={`${day}-${index}`}>
                {day}
              </span>
            ))}
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>How will you track it?</h2>
          <div className="split-row">
            <label className="form-split-field">
              <input
                aria-label="Tracking units"
                inputMode="numeric"
                placeholder="Units"
                value={form.target}
                onChange={(event) => onChange({ target: event.target.value.replace(/\D/g, '') })}
              />
            </label>
            <button className={form.unit ? 'form-split-field select' : 'form-split-field select muted'} type="button" onClick={() => onPickerChange('unit')}>
              <span>{form.unit || 'Miles'}</span>
              <img src={habitDropdownIcon} alt="" />
            </button>
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>{`Start & End Date`}</h2>
          <div className="split-row">
            <button className="form-split-field select muted" type="button">
              <span>Today</span>
              <img src={habitDropdownIcon} alt="" />
            </button>
            <button className="form-split-field select muted" type="button">
              <span>Never</span>
              <img src={habitDropdownIcon} alt="" />
            </button>
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>Require Memo on Completion?</h2>
          <div className="radio-block">
            <button className="radio-row" type="button" onClick={() => onChange({ memoRequired: 'yes' })}>
              <RadioDot checked={form.memoRequired === 'yes'} />
              <span>Yes</span>
            </button>
            <button className="radio-row" type="button" onClick={() => onChange({ memoRequired: 'no' })}>
              <RadioDot checked={form.memoRequired === 'no'} />
              <span>No</span>
            </button>
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>Custom Reminder?</h2>
          <button className="custom-reminder-row" type="button" onClick={() => onPickerChange('reminder')}>
            <img src={habitReminderPlusIcon} alt="" />
            <span>Create</span>
          </button>
        </section>

        <button className="habit-continue-button" type="button" onClick={onContinue}>
          Continue
        </button>
      </div>

      {picker && (
        <HabitPickerSheet
          form={form}
          picker={picker}
          newCategoryValue={newCategoryValue}
          onChange={onChange}
          onClose={() => onPickerChange(null)}
          onPickerChange={onPickerChange}
          onNewCategoryChange={onNewCategoryChange}
          onSaveCategory={onSaveCategory}
        />
      )}
    </div>
  )
}

function HabitColorSection() {
  return (
    <section className="habit-edit-section">
      <h2>What color is this habit?</h2>
      <div className="color-grid">
        {colorRows.map((row) => (
          <div className="color-row" key={row.join('-')}>
            {row.map((color) => (
              <button className="color-swatch" key={color} type="button" aria-label={color}>
                <span style={{ backgroundColor: color }} />
              </button>
            ))}
          </div>
        ))}
        <div className="color-row">
          <button className="selected-color-swatch" type="button" aria-label="Selected blue">
            <img src={habitSelectedColor} alt="" />
          </button>
          {['#410505', '#1f4f05', '#4a0536', '#472405'].map((color) => (
            <button className="color-swatch" key={color} type="button" aria-label={color}>
              <span style={{ backgroundColor: color }} />
            </button>
          ))}
          <button className="color-swatch" type="button" aria-label="Custom color">
            <span className="rainbow-swatch">
              <img src={habitRainbowImage} alt="" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

function FormSelectSection({
  title,
  value,
  muted = false,
  onClick,
}: {
  title: string
  value: string
  muted?: boolean
  onClick: () => void
}) {
  return (
    <section className="habit-edit-section">
      <h2>{title}</h2>
      <button className={muted ? 'detail-select-row muted' : 'detail-select-row'} type="button" onClick={onClick}>
        <span>{value}</span>
        <img src={habitDropdownIcon} alt="" />
      </button>
    </section>
  )
}

function RadioDot({ checked }: { checked: boolean }) {
  return <span className={checked ? 'radio-dot checked' : 'radio-dot'}>{checked && <img src={habitCheckIcon} alt="" />}</span>
}

function HabitPickerSheet({
  form,
  picker,
  newCategoryValue,
  onChange,
  onClose,
  onPickerChange,
  onNewCategoryChange,
  onSaveCategory,
}: {
  form: HabitFormState
  picker: HabitPicker
  newCategoryValue: string
  onChange: (updates: Partial<HabitFormState>) => void
  onClose: () => void
  onPickerChange: (picker: HabitPicker) => void
  onNewCategoryChange: (value: string) => void
  onSaveCategory: () => void
}) {
  const title = picker === 'frequency' ? 'Frequency' : picker === 'unit' ? 'Unit Type' : picker === 'reminder' ? 'Custom Reminder' : 'Group Manager'

  return (
    <div className="manage-picker-overlay" onClick={onClose}>
      <section className="manage-picker-sheet" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-grabber" />
        <button className="sheet-close-button" type="button" onClick={onClose} aria-label={`Close ${title}`}>
          <img src={habitSheetCloseIcon} alt="" />
        </button>
        <h2>{title}</h2>

        {(picker === 'category' || picker === 'categoryCreate') && (
          <div className="picker-body">
            <h3>Categories:</h3>
            {form.category ? (
              <button className="picker-row checked" type="button" onClick={() => onChange({ category: 'Fitness' })}>
                <RadioDot checked />
                <span>{form.category}</span>
              </button>
            ) : picker === 'categoryCreate' ? (
              <label className="picker-row category-input-row">
                <input
                  autoFocus
                  aria-label="Create category"
                  placeholder="Create Category"
                  value={newCategoryValue}
                  onChange={(event) => onNewCategoryChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') onSaveCategory()
                  }}
                />
              </label>
            ) : (
              <button className="picker-row muted create-category-row" type="button" onClick={() => onPickerChange('categoryCreate')}>
                <span className="picker-plus">+</span>
                <span>Create Category</span>
              </button>
            )}
          </div>
        )}

        {picker === 'frequency' && (
          <div className="picker-body picker-options">
            {frequencyOptions.map((option) => (
              <button
                className={form.frequency === option.value ? 'picker-row checked' : 'picker-row'}
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ frequency: option.value })
                  onClose()
                }}
              >
                {form.frequency === option.value && <RadioDot checked />}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}

        {picker === 'unit' && (
          <div className="picker-body picker-options unit-options">
            {unitOptions.map((option) => (
              <button
                className={form.unit === option ? 'picker-row checked' : 'picker-row'}
                key={option}
                type="button"
                onClick={() => {
                  onChange({ unit: option })
                  onClose()
                }}
              >
                {form.unit === option && <RadioDot checked />}
                <span>{option}</span>
              </button>
            ))}
          </div>
        )}

        {picker === 'reminder' && (
          <div className="picker-body reminder-picker-body">
            <PickerTextField
              label="What should it be called?"
              placeholder="Name"
              value={form.reminderName}
              onChange={(value) => onChange({ reminderName: value })}
            />
            <PickerSelectField label="What time for the reminder?" value={form.reminderTime} />
            <PickerSelectField label="What should it sound like?" value={form.reminderSound} />
          </div>
        )}
      </section>
    </div>
  )
}

function PickerTextField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="reminder-picker-field">
      <span>{label}</span>
      <input placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function PickerSelectField({ label, value }: { label: string; value: string }) {
  return (
    <button className="reminder-picker-field select" type="button">
      <span>{label}</span>
      <strong>{value}</strong>
      <img src={habitDropdownIcon} alt="" />
    </button>
  )
}

function SettingsPage() {
  return (
    <>
      <SettingsHeader />
      <div className="content-scroll settings-page">
        {settingsGroups.map((group) => (
          <section className="settings-group" key={group.title}>
            <h2>{group.title}</h2>
            <div className="settings-list">
              {group.rows.map((row) => (
                <SettingsRow key={row.label} {...row} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

function SettingsRow({
  label,
  icon,
  action,
}: {
  label: string
  icon: string
  action?: string
}) {
  return (
    <div className="settings-row">
      <div className="settings-label">
        <img src={icon} alt="" />
        <span>{label}</span>
      </div>
      {action === 'chevron' && <img className="settings-chevron" src={settingsArrowIcon} alt="" />}
      {action === 'external' && <img className="settings-external" src={settingsExternalIcon} alt="" />}
      {action === 'Enabled' && <span className="settings-value">Enabled</span>}
      {action === 'appearance' && (
        <div className="appearance-control" aria-hidden="true">
          <span className="sun-mark" />
          <span className="appearance-toggle">
            <span />
          </span>
          <img src={settingsMoonIcon} alt="" />
        </div>
      )}
    </div>
  )
}

function IndividualHabitPage({
  habit,
  onBack,
  onTimeframeChange,
}: {
  habit: Habit
  onBack: () => void
  onTimeframeChange: (timeframe: Timeframe) => void
}) {
  const nextFrequency = () => {
    const order: Timeframe[] = ['daily', 'weekly', 'monthly']
    const currentIndex = order.indexOf(habit.timeframe)
    onTimeframeChange(order[(currentIndex + 1) % order.length])
  }

  return (
    <div className="habit-detail-screen">
      <div className="habit-detail-header-bg" />
      <header className="habit-detail-header">
        <button type="button" onClick={onBack} aria-label="Back to Track">
          <img src={habitBackIcon} alt="" />
        </button>
        <h1>{habit.title}</h1>
        <button type="button" aria-label="Edit habit">
          <img src={habitEditIcon} alt="" />
        </button>
      </header>
      <div className="habit-detail-content">
        <section className="habit-edit-section">
          <h2>General</h2>
          <div className="habit-name-row">
            <div className="habit-detail-emoji">{habit.emoji}</div>
            <div className="habit-name-field">{habit.title} </div>
          </div>
          <p className="habit-note">
            <span>Note: Be Specific.</span>
            <a href="#tips">Consider These Tips!</a>
          </p>
          <div className="habit-description-box">
            <p>{habit.description}</p>
            <span>0/150</span>
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>What color is this habit?</h2>
          <div className="color-grid">
            {colorRows.map((row) => (
              <div className="color-row" key={row.join('-')}>
                {row.map((color) => (
                  <button className="color-swatch" key={color} type="button" aria-label={color}>
                    <span style={{ backgroundColor: color }} />
                  </button>
                ))}
              </div>
            ))}
            <div className="color-row">
              <button className="selected-color-swatch" type="button" aria-label="Selected blue">
                <img src={habitSelectedColor} alt="" />
              </button>
              {['#410505', '#1f4f05', '#4a0536', '#472405'].map((color) => (
                <button className="color-swatch" key={color} type="button" aria-label={color}>
                  <span style={{ backgroundColor: color }} />
                </button>
              ))}
              <button className="color-swatch" type="button" aria-label="Custom color">
                <span className="rainbow-swatch">
                  <img src={habitRainbowImage} alt="" />
                </span>
              </button>
            </div>
          </div>
        </section>

        <DetailSelectSection title="What category is this habit?" value="Fitness" />

        <section className="habit-edit-section">
          <h2>{`Is {Selected Habit} good for you?`}</h2>
          <div className="radio-block">
            <RadioRow label="Yes" checked />
            <RadioRow label="No" />
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>How frequent is this habit?</h2>
          <button className="detail-select-row" type="button" onClick={nextFrequency}>
            <span>{capitalize(habit.timeframe)}</span>
            <img src={habitDropdownIcon} alt="" />
          </button>
        </section>

        <section className="habit-edit-section">
          <h2>Occurance</h2>
          <div className="occurrence-row">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span className={index === 0 ? 'muted' : ''} key={`${day}-${index}`}>
                {day}
              </span>
            ))}
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>How will you track it?</h2>
          <div className="split-row">
            <div>4</div>
            <div>
              <span>Miles</span>
              <img src={habitDropdownIcon} alt="" />
            </div>
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>{`Start & End Date`}</h2>
          <div className="split-row">
            <div>
              <span>Today</span>
              <img src={habitDropdownIcon} alt="" />
            </div>
            <div>
              <span>Never</span>
              <img src={habitDropdownIcon} alt="" />
            </div>
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>Require Memo on Completion?</h2>
          <div className="radio-block">
            <RadioRow label="Yes" />
            <RadioRow label="No" checked />
          </div>
        </section>

        <section className="habit-edit-section">
          <h2>Custom Reminder?</h2>
          <div className="custom-reminder-row">
            <img src={habitReminderPlusIcon} alt="" />
            <span>Create</span>
          </div>
        </section>
      </div>
      <button className="habit-continue-button" type="button">
        Continue
      </button>
    </div>
  )
}

function DetailSelectSection({ title, value }: { title: string; value: string }) {
  return (
    <section className="habit-edit-section">
      <h2>{title}</h2>
      <div className="detail-select-row">
        <span>{value}</span>
        <img src={habitDropdownIcon} alt="" />
      </div>
    </section>
  )
}

function RadioRow({ label, checked = false }: { label: string; checked?: boolean }) {
  return (
    <div className="radio-row">
      <span className={checked ? 'radio-dot checked' : 'radio-dot'}>{checked && <img src={habitCheckIcon} alt="" />}</span>
      <span>{label}</span>
    </div>
  )
}

function TrackMenu({ onAddHabit, onChangeDay }: { onAddHabit: () => void; onChangeDay: () => void }) {
  return (
    <div className="popup-menu track-popup">
      <MenuItem icon={menuCalendarIcon} label="Change Day" onClick={onChangeDay} />
      <MenuItem icon={menuPlusIcon} label="Add Habit" onClick={onAddHabit} />
      <MenuItem icon={menuPencilIcon} label="Edit Habits" />
      <MenuItem icon={menuStepIcon} label="Skip Habit" />
    </div>
  )
}

function CreateMenu({ onCreateHabit }: { onCreateHabit: () => void }) {
  return (
    <div className="popup-menu create-popup">
      <MenuItem icon={createHabitIcon} label="Create Habit" bold onClick={onCreateHabit} />
      <MenuItem icon={createReminderIcon} label="Create Reminder" bold />
    </div>
  )
}

function MenuItem({
  icon,
  label,
  bold = false,
  onClick,
}: {
  icon: string
  label: string
  bold?: boolean
  onClick?: () => void
}) {
  return (
    <button className={bold ? 'menu-item bold' : 'menu-item'} type="button" onClick={onClick}>
      <img src={icon} alt="" />
      <span>{label}</span>
    </button>
  )
}

function pageLabel(page: Page) {
  return page.charAt(0).toUpperCase() + page.slice(1)
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function toDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDateKey(dateKey: string): TrackDateParts {
  const [year, month, day] = dateKey.split('-').map(Number)
  return { year, monthIndex: month - 1, day }
}

function formatTrackDateLabel(dateKey: string) {
  const date = parseDateKey(dateKey)
  return `${monthNames[date.monthIndex]} ${date.day}${ordinalSuffix(date.day)}`
}

function ordinalSuffix(day: number) {
  if (day >= 11 && day <= 13) return 'th'
  const remainder = day % 10
  if (remainder === 1) return 'st'
  if (remainder === 2) return 'nd'
  if (remainder === 3) return 'rd'
  return 'th'
}

function buildCalendarDays(year: number, monthIndex: number) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: Array<number | null> = []

  for (let index = 0; index < firstWeekday; index += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  while (cells.length < 42) cells.push(null)

  return cells
}

function habitExistsOnDate(habit: Habit, dateKey: string) {
  return !habit.createdOn || habit.createdOn <= dateKey
}

function getHabitValueForDate(habit: Habit, dateKey: string, history: HabitHistory) {
  const dateHistory = history[dateKey]
  if (dateHistory && Object.prototype.hasOwnProperty.call(dateHistory, habit.id)) {
    return dateHistory[habit.id]
  }

  if (dateKey === TRACK_TODAY_KEY) return habit.value
  return historicalHabitValue(habit, dateKey)
}

function historicalHabitValue(habit: Habit, dateKey: string) {
  if (dateKey === '2026-06-08' && habit.title === 'Go Running') return Math.min(habit.target, 1)

  const seed = `${habit.id}-${dateKey}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return Math.min(habit.target, seed % (habit.target + 1))
}

export default App
