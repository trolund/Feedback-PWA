import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Calendar,
  Home,
  CheckCircle,
  User,
  MoreHorizontal
} from 'react-feather'

const links = [
  {
    title: 'Home',
    icon: <Home />,
    href: '/home'
  },
  {
    title: 'Calendar',
    icon: <Calendar />,
    href: '/calendar'
  },
  {
    title: 'Tasks',
    icon: <CheckCircle />,
    href: '/tasks'
  },
  {
    title: 'Profile',
    icon: <User />,
    href: '/profile'
  },
  {
    title: 'Administration',
    icon: <MoreHorizontal />,
    href: '/more'
  }
]

const BottomNav = () => {
  const { pathname } = useRouter()

  return (
    <nav>
      <div>
        {links.map(link => (
          <Link href={link.href} key={link.title}>
            <a
              title={link.title}
              aria-label={link.title}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.icon}
            </a>
          </Link>
        ))}
      </div>

      <style jsx>{`
        nav {
          padding-bottom: env(safe-area-inset-bottom);
          width: 100%;
          height: calc(env(safe-area-inset-top) + 72px);
          background: var(--base);
          border-top: 1px solid var(--divider);
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          bottom: 0;
          transition: var(--transition-colors);
          z-index: 99999;
        }

        nav > div {
          width: 100%;
          max-width: 480px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        nav a {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        nav a :global(> svg) {
          width: 20px;
          height: 20px;
        }

        nav a:active,
        nav a:focus,
        nav a:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        nav a.active {
          color: var(--accent);
        }
      `}</style>
    </nav>
  )
}

export default BottomNav
