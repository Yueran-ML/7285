import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StoreProvider, useStore } from './store/useStore.jsx'
import PhoneFrame from './components/PhoneFrame.jsx'
import TabBar from './components/TabBar.jsx'
import BadgeUnlock from './components/BadgeUnlock.jsx'
import Welcome from './screens/Welcome.jsx'
import Interests from './screens/Interests.jsx'
import Discover from './screens/Discover.jsx'
import Chats from './screens/Chats.jsx'
import Chat from './screens/Chat.jsx'
import Profile from './screens/Profile.jsx'

const slide = {
  initial: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.22 } }),
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
}

function useIsNarrow() {
  const [narrow, setNarrow] = useState(() => window.innerWidth < 560)
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 560)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return narrow
}

function Shell() {
  const { state, dispatch } = useStore()
  const narrow = useIsNarrow()
  const [rawScreen, setScreen] = useState(state.onboarded ? 'discover' : 'welcome')
  const [dir, setDir] = useState(1)
  const [activeGroup, setActiveGroup] = useState(null)

  // A reset (onboarded → false) from any tab screen lands on Welcome. Derived, not effect-driven.
  const screen = state.onboarded || rawScreen === 'interests' ? rawScreen : 'welcome'

  const go = (next, d = 1) => {
    setDir(d)
    setScreen(next)
  }
  const openChat = (id) => {
    setActiveGroup(id)
    go('chat', 1)
  }

  const tabScreen = ['discover', 'chats', 'profile'].includes(screen)
  const notDoneToday = state.joinedGroups.filter((g) => state.checkIns[g] !== state.day).length

  return (
    <>
      <AnimatePresence custom={dir} initial={false}>
        {screen === 'welcome' && (
          <motion.div key="welcome" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            <Welcome onNext={() => go('interests', 1)} />
          </motion.div>
        )}
        {screen === 'interests' && (
          <motion.div key="interests" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            <Interests onBack={() => go(state.onboarded ? 'discover' : 'welcome', -1)} onNext={() => go('discover', 1)} />
          </motion.div>
        )}
        {screen === 'discover' && (
          <motion.div key="discover" variants={fade} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            <Discover onOpenChat={openChat} onEditInterests={() => go('interests', -1)} />
          </motion.div>
        )}
        {screen === 'chats' && (
          <motion.div key="chats" variants={fade} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            <Chats onOpenChat={openChat} onDiscover={() => go('discover', -1)} />
          </motion.div>
        )}
        {screen === 'profile' && (
          <motion.div key="profile" variants={fade} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', inset: 0 }}>
            <Profile narrow={narrow} />
          </motion.div>
        )}
        {screen === 'chat' && activeGroup && (
          <motion.div key={`chat-${activeGroup}`} custom={dir} variants={slide} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', inset: 0, background: 'var(--cream)', zIndex: 35 }}>
            <Chat groupId={activeGroup} onBack={() => go('chats', -1)} />
          </motion.div>
        )}
      </AnimatePresence>

      {tabScreen && <TabBar active={screen} onChange={(t) => go(t, 1)} unread={notDoneToday} />}

      <BadgeUnlock badgeId={state.pendingBadges[0]} onClose={() => dispatch({ type: 'DISMISS_BADGE' })} />
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <PhoneFrame>
        <Shell />
      </PhoneFrame>
    </StoreProvider>
  )
}
